#!/usr/bin/env python
"""One-off converter: preview-site HTML fragments -> React page components.

Reads the fragments produced from earthyroots-site-preview.html and writes
src/pages/*.jsx.  Handles the handful of HTML-isms the preview markup uses:
class/style attributes, void tags, comments, .html links and inline handlers.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
EXT = os.path.join(os.path.dirname(APP), ".preview-extract")

PAGES = {
    "index": "Index",
    "about": "About",
    "project-1": "ProjectAamra",
    "amenities": "Amenities",
    "gallery": "Gallery",
    "contact": "Contact",
}

ROUTES = {
    "index.html": "/",
    "about.html": "/about",
    "project-1.html": "/project-1",
    "amenities.html": "/amenities",
    "gallery.html": "/gallery",
    "contact.html": "/contact",
}

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}

ATTR = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex",
    "srcset": "srcSet", "colspan": "colSpan", "rowspan": "rowSpan",
    "maxlength": "maxLength", "readonly": "readOnly", "autoplay": "autoPlay",
    "playsinline": "playsInline", "allowfullscreen": "allowFullScreen",
    "frameborder": "frameBorder", "referrerpolicy": "referrerPolicy",
    "crossorigin": "crossOrigin", "novalidate": "noValidate",
}

TAG_RE = re.compile(r"<!--.*?-->|<(/?)([a-zA-Z][^\s/>]*)((?:[^<>\"']|\"[^\"]*\"|'[^']*')*?)(/?)>", re.S)
ATTR_RE = re.compile(r"([^\s=/>]+)(?:\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+))?")


def style_object(raw):
    decls = []
    for part in raw.split(";"):
        if ":" not in part:
            continue
        key, _, val = part.partition(":")
        key, val = key.strip(), val.strip()
        if not key:
            continue
        if key.startswith("--"):
            key = f"'{key}'"
        else:
            bits = key.split("-")
            key = bits[0] + "".join(b.capitalize() for b in bits[1:])
        decls.append(f"{key}: '{val.replace(chr(39), chr(92) + chr(39))}'")
    return "{{ " + ", ".join(decls) + " }}"


def convert_attrs(raw):
    out = []
    for m in ATTR_RE.finditer(raw):
        name = m.group(1)
        if not name or name in ("/",):
            continue
        low = name.lower()
        if low.startswith("on"):          # inline handlers are ported in JS instead
            continue
        val = m.group(2)
        prop = ATTR.get(low, name)
        if low.startswith("data-") or low.startswith("aria-"):
            prop = low
        if val is None:
            out.append(prop)
            continue
        v = val[1:-1] if val[:1] in "\"'" else val
        if low == "style":
            out.append(f"style={style_object(v)}")
            continue
        if low == "href" and v in ROUTES:
            v = ROUTES[v]
        v = v.replace('"', "&quot;")
        out.append(f'{prop}="{v}"')
    return (" " + " ".join(out)) if out else ""


def escape_text(text):
    return text.replace("{", "&#123;").replace("}", "&#125;").replace("<", "&lt;")


def to_jsx(source):
    out, pos = [], 0
    for m in TAG_RE.finditer(source):
        if m.start() > pos:
            out.append(escape_text(source[pos:m.start()]))
        tok = m.group(0)
        if tok.startswith("<!--"):
            body = tok[4:-3].strip().replace("*/", "* /")
            out.append("{/* " + body + " */}")
        elif m.group(1) == "/":
            out.append(f"</{m.group(2)}>")
        else:
            name = m.group(2)
            attrs = convert_attrs(m.group(3))
            close = m.group(4) == "/" or name.lower() in VOID
            out.append(f"<{name}{attrs}" + (" />" if close else ">"))
        pos = m.end()
    if pos < len(source):
        out.append(escape_text(source[pos:]))
    return "".join(out)


def indent(body, pad=4):
    return "\n".join((" " * pad + line) if line.strip() else line for line in body.split("\n"))


def main():
    for slug, comp in PAGES.items():
        src = os.path.join(EXT, f"page-{slug}.html")
        html = open(src, encoding="utf-8").read().strip()
        jsx = to_jsx(html)
        # the preview toggles .pg on/off; React renders one page at a time
        jsx = jsx.replace(f'className="pg" data-pg="{slug}"', f'className="pg on" data-pg="{slug}"')
        code = (
            "export default function " + comp + "() {\n"
            "  return (\n"
            "    <>\n"
            + indent(jsx)
            + "\n    </>\n"
            "  )\n"
            "}\n"
        )
        out = os.path.join(APP, "src", "pages", comp + ".jsx")
        open(out, "w", encoding="utf-8", newline="\n").write(code)
        print(f"{slug} -> src/pages/{comp}.jsx ({len(jsx)} chars)")


if __name__ == "__main__":
    main()
