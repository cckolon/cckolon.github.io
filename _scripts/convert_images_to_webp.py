#!/usr/bin/env python3
"""Convert images referenced in _posts/ to WebP format.

Handles:
  - Front matter `image:` field
  - Markdown image syntax: ![alt](path){: ...}
  - HTML <img src="..."> tags
  - Jekyll {% include fim.html url="..." %} includes

Skips:
  - External URLs (http/https)
  - Images already in WebP format
  - GIFs (likely animated)
  - SVGs

Usage:
  python convert_images_to_webp.py [--dry-run] [--site-root PATH] [--quality N]
"""

import argparse
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)


SKIP_EXTENSIONS = {".webp", ".gif", ".svg"}


def is_local_image(path: str) -> bool:
    """Return True if path is a local asset reference (not an external URL)."""
    return (
        path.startswith("/assets/")
        and not path.startswith("//")
        and "://" not in path
    )


def should_convert(path: str) -> bool:
    """Return True if the image format should be converted to WebP."""
    return Path(path).suffix.lower() not in SKIP_EXTENSIONS


def get_filesystem_path(site_root: Path, image_path: str) -> Path:
    """Convert a site-relative path (/assets/...) to an absolute filesystem path."""
    return site_root / image_path.lstrip("/")


def webp_site_path(image_path: str) -> str:
    """Return the site-relative path with the extension replaced by .webp."""
    return str(Path(image_path).with_suffix(".webp"))


def convert_to_webp(source: Path, quality: int) -> Path | None:
    """Convert source image to WebP beside the original. Returns the WebP path, or None on failure."""
    dest = source.with_suffix(".webp")

    if dest.exists():
        print(f"    [skip]    {dest.name} already exists")
        return dest

    try:
        with Image.open(source) as img:
            # Palette mode must be converted before saving as WebP
            if img.mode == "P":
                img = img.convert("RGBA")
            img.save(dest, "WEBP", quality=quality, method=6)
        print(f"    [convert] {source.name} -> {dest.name}")
        return dest
    except Exception as exc:
        print(f"    [error]   {source}: {exc}")
        return None


def extract_image_paths(content: str) -> set[str]:
    """Return all unique local, convertible image paths found in post content."""
    paths: set[str] = set()

    # --- 1. Front matter image: field ---
    # Front matter is the first YAML block between --- delimiters.
    fm_match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if fm_match:
        fm = fm_match.group(1)
        for m in re.finditer(r"^image:\s*(\S+)", fm, re.MULTILINE):
            paths.add(m.group(1))

    # --- 2. Markdown images: ![alt](/assets/...) ---
    for m in re.finditer(r"!\[[^\]]*\]\((/assets/[^)\s]+)\)", content):
        paths.add(m.group(1))

    # --- 3. HTML <img> tags ---
    for m in re.finditer(r"<img\b[^>]+\bsrc=['\"]([^'\"]+)['\"]", content, re.IGNORECASE):
        paths.add(m.group(1))

    # --- 4. Jekyll includes with a url= parameter (e.g. fim.html) ---
    for m in re.finditer(r"\{%[^%]*\burl=['\"]([^'\"]+)['\"]", content):
        paths.add(m.group(1))

    return {p for p in paths if is_local_image(p) and should_convert(p)}


def process_post(post: Path, site_root: Path, quality: int, dry_run: bool) -> None:
    """Process one post: convert referenced images to WebP and rewrite paths."""
    content = post.read_text(encoding="utf-8")
    image_paths = extract_image_paths(content)

    if not image_paths:
        return

    print(f"\n{post.name}")

    replacements: dict[str, str] = {}

    for orig_path in sorted(image_paths):
        fs = get_filesystem_path(site_root, orig_path)

        if not fs.exists():
            print(f"    [missing] {orig_path}")
            continue

        new_site_path = webp_site_path(orig_path)

        if dry_run:
            print(f"    [dry-run] {orig_path} -> {new_site_path}")
            replacements[orig_path] = new_site_path
        else:
            webp_fs = convert_to_webp(fs, quality)
            if webp_fs is not None:
                replacements[orig_path] = "/" + str(webp_fs.relative_to(site_root))

    if not replacements:
        return

    new_content = content
    for orig, new in replacements.items():
        new_content = new_content.replace(orig, new)

    if new_content == content:
        return

    if dry_run:
        print(f"    [dry-run] would rewrite {post.name}")
    else:
        post.write_text(new_content, encoding="utf-8")
        print(f"    [updated] {post.name}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert post images to WebP")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would happen without making any changes",
    )
    parser.add_argument(
        "--site-root",
        type=Path,
        default=Path("."),
        help="Jekyll site root directory (default: current directory)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=85,
        help="WebP quality 1-100 (default: 85)",
    )
    args = parser.parse_args()

    site_root = args.site_root.resolve()
    posts_dir = site_root / "_posts"

    if not posts_dir.exists():
        print(f"Error: _posts/ not found under {site_root}")
        sys.exit(1)

    posts = sorted(posts_dir.glob("*.md"))
    print(f"Found {len(posts)} posts in {posts_dir}")

    if args.dry_run:
        print("(dry-run mode — no files will be changed)\n")

    for post in posts:
        process_post(post, site_root, args.quality, args.dry_run)

    print("\nDone.")


if __name__ == "__main__":
    main()
