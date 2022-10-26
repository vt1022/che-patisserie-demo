import { GoogleSpreadsheet } from "google-spreadsheet"
import { CLIENT_EMAIL, PRIVATE_KEY, SPREADSHEET_ID } from "../configs"

const addRow = async (sheetId, newRow) => {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
    try {
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        })
        // loads document properties and worksheets
        await doc.loadInfo()
        const sheet = doc.sheetsById[sheetId]
        await sheet.addRow(newRow)
    } catch (e) {
        console.error("Error: ", e)
    }
}

export default addRow
