import re


def clean_clinical_text(text: str) -> str:
    """Strip markdown and normalize LLM output for clinical display."""
    if not text:
        return text

    cleaned = text.strip()

    cleaned = re.sub(r"\*\*(.+?)\*\*", r"\1", cleaned)
    cleaned = re.sub(r"__(.+?)__", r"\1", cleaned)
    cleaned = re.sub(r"(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\w)", r"\1", cleaned)
    cleaned = re.sub(r"(?<!\w)_(?!_)(.+?)(?<!_)_(?!\w)", r"\1", cleaned)
    cleaned = re.sub(r"^#+\s*", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"^Clinical Assessment:\s*", "", cleaned, flags=re.IGNORECASE | re.MULTILINE)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)

    return cleaned.strip()
