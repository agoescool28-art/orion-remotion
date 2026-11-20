
import argparse
import json
from pathlib import Path

import whisperx


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--audio",
        required=True,
        help="Lokasi file VO"
    )

    parser.add_argument(
        "--output",
        default="src/audio/prabowo.words.ts"
    )

    parser.add_argument(
        "--device",
        default="cpu"
    )

    args = parser.parse_args()

    audio_path = Path(args.audio)

    if not audio_path.exists():
        raise FileNotFoundError(audio_path)

    print("Memuat audio...")
    audio = whisperx.load_audio(str(audio_path))

    print("Transkripsi bahasa Indonesia...")
    model = whisperx.load_model(
        "large-v3",
        args.device,
        compute_type="int8",
        language="id",
    )

    result = model.transcribe(
        audio,
        batch_size=4
    )

    print("Memuat model word alignment...")

    try:
        align_model, metadata = whisperx.load_align_model(
            language_code="id",
            device=args.device,
        )

        aligned = whisperx.align(
            result["segments"],
            align_model,
            metadata,
            audio,
            args.device,
            return_char_alignments=False,
        )

    except Exception as error:
        raise RuntimeError(
            "Word alignment bahasa Indonesia gagal. "
            "Tidak dibuat timestamp perkiraan. "
            f"Detail: {error}"
        )

    words = []

    for segment in aligned["segments"]:
        for item in segment.get("words", []):

            text = (item.get("word") or "").strip()
            start = item.get("start")
            end = item.get("end")

            if not text or start is None or end is None:
                continue

            if end <= start:
                continue

            words.append({
                "text": text,
                "start": round(float(start), 4),
                "end": round(float(end), 4),
                "score": round(
                    float(item.get("score", 0)),
                    4
                ),
            })

    if not words:
        raise RuntimeError(
            "Tidak ada timestamp kata yang berhasil dibuat."
        )

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)

    content = (
        'import type { AudioWordCue } from "./types";\n\n'
        "// Generated from voice-over alignment.\n"
        "export const prabowoWords: AudioWordCue[] = "
        + json.dumps(words, ensure_ascii=False, indent=2)
        + ";\n"
    )

    output.write_text(
        content,
        encoding="utf-8"
    )

    print(f"Berhasil: {len(words)} kata")
    print(f"File: {output}")


if __name__ == "__main__":
    main()
