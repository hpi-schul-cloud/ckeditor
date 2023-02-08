import { add } from "@ckeditor/ckeditor5-utils/src/translation-service.js";

const translations = {
    "Display mode": "Line break",
};

export default function() {
    add("en", translations);
}