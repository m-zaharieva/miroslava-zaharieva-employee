import { useState, useEffect } from "react";
import agregateData from "./services/resultHandler";

export default function CsvReader() {
    const [csvFile, setCsvFile] = useState();
    const [csvArray, setCsvArray] = useState([]);
    const [bestTandems, setBestTandems] = useState({});

    useEffect(() => {
        setBestTandems({...agregateData(csvArray)});
    }, [csvArray]);


    const processCSV = (str, delim = ',') => {
        const rows = str.split(/\r\n|\n/);
        const headers = rows[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        rows.splice(0, 1);

        /* Remove blank rows */
        rows.forEach((row, index, self) => {
            if (Object.values(row).filter(x => x.length > 0).length == 0) {
                rows.splice(index, 1);
            }
        });

        /* Convert String Rows to Objects */
        const newArray = rows.map(row => {
            const values = row.split(delim);
            const eachObject = headers.reduce((obj, header, i) => {
                obj[header] = values[i];
                return obj;
            }, {})
            return eachObject;
        })

        /* Change the state */
        setCsvArray(newArray);
    }
    
    
    const uploadHandler = () => {
        const file = csvFile;
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const text = e.target.result;
            console.log(text);
            processCSV(text);
        }

        reader.readAsText(file);
    }
    


    return (
        <>
            <section className='fileUpload'>
                <h1>Find the pair of employees who have worked together on common projects for the longest period of time</h1>
                <p>Upload your file here</p>
                <p className="required-file-format">The file format must be <span>.csv</span></p>
                <form id="csv-form">

                    <input
                        type="file"
                        id='csvFile'
                        name='file'
                        accept=".csv"
                        onChange={(e) => {
                            setCsvFile(e.target.files[0])
                        }}
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (csvFile) { uploadHandler() }
                        }}
                    >
                        Submit
                    </button>
                </form>
            </section>

            {/* Two employees, who worked on common project for the longest perion of time */}
            <section className='table-section'>
                <h2>Result:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>EmployeeID 1</th>
                            <th>EmployeeID 2</th>
                            <th>Project ID</th>
                            <th>Days worked</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bestTandems.tandem
                                ? (
                                    <tr>
                                        <td>{bestTandems.tandem[0]}</td>
                                        <td>{bestTandems.tandem[1]}</td>
                                        <td>{bestTandems.projectId}</td>
                                        <td>{bestTandems.days}</td>
                                    </tr>
                                )
                                : <tr></tr> 
                        }
                    </tbody>
                </table>

                {/* Uploaded date from .csv file */}
                <h2>Uploaded Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>EmpID</th>
                            <th>ProjectID</th>
                            <th>Date From</th>
                            <th>Date To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            csvArray.length > 0
                                ? csvArray.map((row, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{row.EmpID}</td>
                                            <td>{row.ProjectID}</td>
                                            <td>{row.DateFrom}</td>
                                            <td>{row.DateTo}</td>
                                        </tr>
                                    )
                                })
                                : null
                        }
                    </tbody>
                </table>

            </section>
        </>

    )
}