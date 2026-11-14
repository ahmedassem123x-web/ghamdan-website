# Lucide-style line icons (stroke 2, round caps) — inline SVG, no icon font.
# Every icon is drawn in code; no emoji anywhere on the site.
ICONS = {
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    "droplet": '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    "leaf": '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    "zap": '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    "battery": '<rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/><line x1="6" x2="6" y1="11" y2="13"/><line x1="10" x2="10" y1="11" y2="13"/><line x1="14" x2="14" y1="11" y2="13"/>',
    "wrench": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "mail": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    "filter": '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    "arrow": '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    "check": '<polyline points="20 6 9 17 4 12"/>',
    "menu": '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
    "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "globe": '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    "message": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "facebook": '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    "instagram": '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    "linkedin": '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    "youtube": '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    "home": '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    "package": '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.7 5 7.7-5"/><path d="M7.5 4.27 16.5 9.18"/>',
    "database": '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    "camera": '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    "sliders": '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
    "shield": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    "file": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "eye": '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "info": '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    "alert": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    "chevron": '<path d="m6 9 6 6 6-6"/>',
    "grid": '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    "logout": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    "edit": '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    "trash": '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>',
    "headset": '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm18 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5Z"/><path d="M21 11v-2a9 9 0 0 0-18 0v2"/>',
    "gauge": '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    "layers": '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
}


def icon(name, cls=""):
    inner = ICONS.get(name, ICONS["info"])
    c = f' class="{cls}"' if cls else ""
    return (f'<svg{c} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" '
            f'aria-hidden="true">{inner}</svg>')


# ---------------------------------------------------------------------------
# Code-built product illustrations (SVG line-art, tokens palette).
# These are development placeholders (CI-06) — clean silhouettes on the
# light-grey square, exactly like the reference product cut-outs.
# ---------------------------------------------------------------------------
NAVY = "#0F2E4D"
BLUE = "#1E8FE8"
SKY = "#B2D3F0"
MUTED = "#5A6470"
LIGHT = "#EEF3F7"


def product_svg(kind):
    """Return an inline SVG illustration for a product type."""
    if kind == "panel":
        cells = ""
        for r in range(3):
            for c in range(5):
                x = 30 + c * 34
                y = 40 + r * 34
                cells += f'<rect x="{x}" y="{y}" width="30" height="30" rx="2" fill="{SKY}" stroke="{NAVY}" stroke-width="2"/>'
        return (f'<svg viewBox="0 0 240 200" fill="none" aria-hidden="true">'
                f'<rect x="14" y="24" width="212" height="128" rx="8" fill="#FFFFFF" stroke="{NAVY}" stroke-width="3"/>'
                f'{cells}'
                f'<path d="M70 152v18M170 152v18" stroke="{NAVY}" stroke-width="4" stroke-linecap="round"/>'
                f'<path d="M40 178h160" stroke="{NAVY}" stroke-width="4" stroke-linecap="round"/></svg>')
    if kind == "battery":
        return (f'<svg viewBox="0 0 240 200" fill="none" aria-hidden="true">'
                f'<rect x="80" y="30" width="80" height="140" rx="10" fill="#FFFFFF" stroke="{NAVY}" stroke-width="3"/>'
                f'<rect x="100" y="18" width="40" height="12" rx="4" fill="{NAVY}"/>'
                f'<rect x="96" y="52" width="48" height="10" rx="5" fill="{BLUE}"/>'
                f'<rect x="96" y="72" width="48" height="10" rx="5" fill="{BLUE}" opacity="0.65"/>'
                f'<rect x="96" y="92" width="48" height="10" rx="5" fill="{BLUE}" opacity="0.35"/>'
                f'<circle cx="120" cy="140" r="12" stroke="{NAVY}" stroke-width="3"/>'
                f'<path d="M120 132v16M112 140h16" stroke="{NAVY}" stroke-width="3" stroke-linecap="round"/></svg>')
    if kind == "pump":
        return (f'<svg viewBox="0 0 240 200" fill="none" aria-hidden="true">'
                f'<rect x="90" y="70" width="60" height="100" rx="8" fill="#FFFFFF" stroke="{NAVY}" stroke-width="3"/>'
                f'<path d="M120 70V40" stroke="{NAVY}" stroke-width="6" stroke-linecap="round"/>'
                f'<path d="M120 40c30 0 50 12 60 30" stroke="{BLUE}" stroke-width="5" stroke-linecap="round"/>'
                f'<circle cx="120" cy="105" r="16" stroke="{NAVY}" stroke-width="3"/>'
                f'<path d="M120 97v16M112 105h16" stroke="{NAVY}" stroke-width="3" stroke-linecap="round"/>'
                f'<path d="M80 170h80" stroke="{NAVY}" stroke-width="4" stroke-linecap="round"/>'
                f'<path d="M60 150c10-8 20 8 30 0s20 8 30 0 20 8 30 0" stroke="{BLUE}" stroke-width="3" stroke-linecap="round"/></svg>')
    if kind == "controller":
        return (f'<svg viewBox="0 0 240 200" fill="none" aria-hidden="true">'
                f'<rect x="70" y="40" width="100" height="120" rx="10" fill="#FFFFFF" stroke="{NAVY}" stroke-width="3"/>'
                f'<rect x="86" y="56" width="68" height="34" rx="4" fill="{LIGHT}" stroke="{NAVY}" stroke-width="2"/>'
                f'<path d="M96 73h24M96 81h16" stroke="{BLUE}" stroke-width="4" stroke-linecap="round"/>'
                f'<circle cx="120" cy="122" r="16" stroke="{NAVY}" stroke-width="3"/>'
                f'<path d="M120 122l8-8" stroke="{NAVY}" stroke-width="3" stroke-linecap="round"/>'
                f'<circle cx="92" cy="122" r="5" fill="{BLUE}"/><circle cx="148" cy="122" r="5" fill="{BLUE}"/></svg>')
    if kind == "camera":
        return (f'<svg viewBox="0 0 240 200" fill="none" aria-hidden="true">'
                f'<rect x="60" y="60" width="120" height="80" rx="12" fill="#FFFFFF" stroke="{NAVY}" stroke-width="3"/>'
                f'<circle cx="120" cy="100" r="26" stroke="{NAVY}" stroke-width="3"/>'
                f'<circle cx="120" cy="100" r="12" fill="{BLUE}"/>'
                f'<circle cx="126" cy="94" r="4" fill="#FFFFFF"/>'
                f'<path d="M100 60l10-18h20l10 18" stroke="{NAVY}" stroke-width="3" stroke-linejoin="round"/>'
                f'<path d="M120 140v20M90 160h60" stroke="{NAVY}" stroke-width="4" stroke-linecap="round"/></svg>')
    # inverter (default)
    return (f'<svg viewBox="0 0 240 200" fill="none" aria-hidden="true">'
            f'<rect x="70" y="34" width="100" height="132" rx="10" fill="#FFFFFF" stroke="{NAVY}" stroke-width="3"/>'
            f'<rect x="86" y="50" width="68" height="30" rx="4" fill="{NAVY}"/>'
            f'<path d="M96 65h30" stroke="{BLUE}" stroke-width="4" stroke-linecap="round"/>'
            f'<path d="M86 100h68M86 116h68M86 132h44" stroke="{SKY}" stroke-width="6" stroke-linecap="round"/>'
            f'<circle cx="120" cy="152" r="6" fill="{BLUE}"/>'
            f'<path d="M96 166v10M144 166v10" stroke="{NAVY}" stroke-width="4" stroke-linecap="round"/></svg>')


def kind_for(category, model):
    m = (model or "").lower()
    if category == "panels":
        return "panel"
    if category == "batteries":
        return "battery"
    if category == "pumps":
        return "pump"
    if category == "controllers":
        return "controller"
    if category == "cameras":
        return "camera"
    return "inverter"
