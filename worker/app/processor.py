from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

SUPPORTED_OPERATIONS = {"uppercase", "lowercase", "reverse", "word_count"}


@dataclass(frozen=True)
class ProcessedTask:
    result: str
    logs: list[dict[str, object]]


def now() -> datetime:
    return datetime.now(timezone.utc)


def process_task(operation: str, input_text: str) -> ProcessedTask:
    operation = operation.strip().lower()

    if operation not in SUPPORTED_OPERATIONS:
        raise ValueError(f"Unsupported operation: {operation}")

    started_at = now()
    logs: list[dict[str, object]] = [
        {
            "level": "info",
            "message": f"Task processing started for operation '{operation}'",
            "at": started_at,
        }
    ]

    if operation == "uppercase":
        result = input_text.upper()
    elif operation == "lowercase":
        result = input_text.lower()
    elif operation == "reverse":
        result = input_text[::-1]
    else:
        result = str(len([word for word in input_text.split() if word]))

    logs.append(
        {
            "level": "info",
            "message": "Task processing completed successfully",
            "at": now(),
        }
    )

    return ProcessedTask(result=result, logs=logs)
