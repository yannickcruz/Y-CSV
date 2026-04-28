import "../css/Editor.css"
import { useRef } from "react";

const Editor = (csv) => {

    // Exemplo de JSON de CSV
    const csv_example = [
        {
            Filename: "image_filename.jpg",
            Title: "A short description of what the asset represents",
            Keywords: "Keyword1, Keyword2, Keyword3, Keyword4, Keyword5",
            Category: 3,
            Releases: "Haleeq Whitten, Ludovic Hillion, Morgan Greentstreet, Christine Manore"
        },
        {
            Filename: "footage_filename.mov",
            Title: "Up to 200 characters",
            Keywords: "Most important keywords first. Max 49 keywords.",
            Category: "Enter the number matching the category in the upload-CSV dialog",
            Releases: "The names you gave to the releases when you uploaded them on Adobe Stock"
        }
    ];

    const headers = csv_example.length > 0 ? Object.keys(csv_example[0]) : [];


    return(
        <section id="Editor">
            <header id="editor-header">
                <h1 id="editor-title">Y-CSV</h1>
            </header>

            <div id="table-container">
                <table id="csv-table">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {csv_example.map((row, index) => (
                            <tr key={index}>
                                {headers.map((header) => (
                                    <td key={header}>{row[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                    
            </div>
        </section>
    )
}

export default Editor