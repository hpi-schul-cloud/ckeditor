import { add } from "@ckeditor/ckeditor5-utils/src/translation-service.js";

const translations = {
    "Equation preview": "Vista previa",
    "Insert equation in TeX format.": "Insertar ecuación en formato TeX",
    "Display mode": "Salto de línea",
    "Insert math": "Fórmula",
};

export default function() {
    add("es", translations);
}