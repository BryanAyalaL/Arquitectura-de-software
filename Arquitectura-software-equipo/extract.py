import os

# Script para extraer el código de un proyecto y guardarlo en un archivo Markdown
# Ruta del proyecto a analizar y archivo de salida
ROOT_DIR = "/home/bryan/Documentos/Arquitectura-de-software"
OUTPUT_FILE = "project_dump.md"

CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".c", ".cpp",
    ".cs", ".go", ".rb", ".php", ".html", ".css", ".scss",
    ".json", ".yaml", ".yml", ".sh", ".md", ".sql", ".xml", ".swift", ".kt", ".dart"
}

IGNORE_DIRS = {
    ".venv", "venv", "__pycache__", ".git", "node_modules",
    "dist", "build", ".idea", ".vscode", ".mypy_cache",".env"
}

EXT_TO_LANG = {
    ".py": "python",
    ".js": "javascript",
    ".ts": "typescript",
    ".jsx": "jsx",
    ".tsx": "tsx",
    ".html": "html",
    ".css": "css",
    ".json": "json",
    ".sh": "bash",
    ".yaml": "yaml",
    ".yml": "yaml"
}


def is_code_file(filename):
    return any(filename.endswith(ext) for ext in CODE_EXTENSIONS)


def get_lang(filename):
    ext = os.path.splitext(filename)[1]
    return EXT_TO_LANG.get(ext, "")


def extract_project(root, output_file):
    with open(output_file, "w", encoding="utf-8") as out:

        out.write("# Project Code Dump\n\n")

        for foldername, subfolders, filenames in os.walk(root):

            subfolders[:] = [d for d in subfolders if d not in IGNORE_DIRS]

            level = foldername.replace(root, "").count(os.sep)
            indent = "#" * (level + 2)
            folder_label = os.path.basename(foldername) or root

            out.write(f"{indent} 📁 {folder_label}\n\n")

            for file in filenames:
                if not is_code_file(file):
                    continue

                filepath = os.path.join(foldername, file)
                lang = get_lang(file)

                out.write(f"**File:** `{filepath}`\n\n")
                out.write(f"```{lang}\n")

                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        out.write(f.read())
                except Exception as e:
                    out.write(f"[ERROR READING FILE: {e}]")

                out.write("\n```\n\n")


if __name__ == "__main__":
    extract_project(ROOT_DIR, OUTPUT_FILE)
    print("Markdown export complete.")