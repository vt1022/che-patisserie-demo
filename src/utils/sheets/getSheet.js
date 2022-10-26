// currently unused
// import { GoogleSpreadsheet } from "google-spreadsheet";
// import { CLIENT_EMAIL, PRIVATE_KEY, SPREADSHEET_ID, MAC_FLAVOURS_SHEET_ID, WEEKLY_FLAVOURS_SHEET_ID } from "./configs";

// export const getSheet = (dispatch) => {
//     const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
//     (async () => {
//         dispatch({ type: "loading" });
//         try {
//             await doc.useServiceAccountAuth({
//                 client_email: CLIENT_EMAIL,
//                 private_key: PRIVATE_KEY,
//             });
//             // loads document properties and worksheets
//             await doc.loadInfo();
//             // get data in each row as objects in an array
//             dispatch({
//                 type: "setFlavours",
//                 data: {
//                     all: await doc.sheetsById[MAC_FLAVOURS_SHEET_ID].getRows(),
//                     weekly: await doc.sheetsById[WEEKLY_FLAVOURS_SHEET_ID].getRows(),
//                 },
//             });
//         } catch (e) {
//             console.error("Error: ", e);
//         } finally {
//             dispatch({ type: "loading" });
//         }
//     })();
// };
