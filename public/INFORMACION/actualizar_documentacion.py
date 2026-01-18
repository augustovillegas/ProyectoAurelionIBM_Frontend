import nbformat
import re

NOTEBOOK_PATH = "Proyecto_Aurelion.ipynb"
MARKDOWN_PATH = "DOCUMENTACION.md"


def extraer_outputs_de_celda(celda):
    outputs = []
    for output in celda.get('outputs', []):
        if output.output_type == 'stream':
            outputs.append(output.text)
        elif output.output_type == 'execute_result':
            data = output.get('data', {})
            if 'text/plain' in data:
                outputs.append(data['text/plain'])
        elif output.output_type == 'display_data':
            data = output.get('data', {})
            if 'text/plain' in data:
                outputs.append(data['text/plain'])
    return outputs


def actualizar_markdown_con_outputs():
    # Leer notebook
    with open(NOTEBOOK_PATH, encoding="utf-8") as f:
        nb = nbformat.read(f, as_version=4)

    # Leer markdown
    with open(MARKDOWN_PATH, encoding="utf-8") as f:
        md = f.read()

    # Buscar bloques de código en el markdown
    code_blocks = list(re.finditer(r"```python(.*?)```", md, re.DOTALL))
    md_nuevo = md
    offset = 0
    celda_idx = 0


    for match in code_blocks:
        # Buscar la siguiente celda de código en el notebook
        while celda_idx < len(nb.cells):
            celda = nb.cells[celda_idx]
            celda_idx += 1
            if celda.cell_type == "code":
                break
        else:
            break  # No más celdas de código

        outputs = extraer_outputs_de_celda(celda)
        if outputs:
            # Unir todos los outputs en un solo bloque, con formato markdown personalizado
            output_block = '\n'.join([o.strip() for o in outputs if o.strip()])
            output_md = '\n```output\n' + output_block + '\n```\n'
            # Insertar el bloque después del bloque de código
            insert_pos = match.end() + offset
            md_nuevo = md_nuevo[:insert_pos] + '\n' + output_md + md_nuevo[insert_pos:]
            offset += len(output_md) + 1

    # Guardar el markdown actualizado
    with open(MARKDOWN_PATH, "w", encoding="utf-8") as f:
        f.write(md_nuevo)

    print("✅ DOCUMENTACION.md actualizada con outputs del notebook.")


if __name__ == "__main__":
    actualizar_markdown_con_outputs()
