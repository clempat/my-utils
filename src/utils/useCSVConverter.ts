import { useEffect, useState } from "react";
import neatCsv from "neat-csv";
import dayjs from "dayjs";
import stringify from "csv-stringify";

export enum CONVERTER {
  CONSORS = "CONSORS",
  N26 = "N26",
  POSTBANK = "POSTBANK",
}

type Consors = {
  "BIC / BLZ": string;
  "Betrag in EUR": string;
  Buchungstext: string;
  "IBAN / Konto-Nr.": string;
  "Sender / Empfänger": string;
  Valuta: string;
  Verwendungszweck: string;
  Buchung: string;
};

type YNAB = {
  Date: string;
  Payee: string;
  Memo: string;
  Outflow: string;
  Inflow: string;
};

type N26 = {
  Date: string;
  Bénéficiaire: string;
  "Numéro de compte": string;
  "Type de transaction": string;
  "Référence de paiement": string;
  Catégorie: string;
  "Montant (EUR)": string;
  "Montant (Devise étrangère)": string;
  "Sélectionnez la devise étrangère": string;
  "Taux de conversion": string;
};

type POSTBANK = {
  Buchungsdatum: string;
  Wertstellung: string;
  Umsatzart: string;
  Buchungsdetails: string;
  Auftraggeber: string;
  Empfänger: string;
  "Betrag (€)": string;
  "Saldo (€)": string;
};

async function createCsv(data: any, filename: string) {
  stringify(data, { header: true }, (error, parsed) => {
    if (error) {
      throw error;
    }
    if (!parsed) {
      throw new Error("Empty File");
    }
    const blob = new Blob([parsed], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

function n262Ynab(input: N26): YNAB {
  const value = parseFloat(input["Montant (EUR)"]);
  return {
    Date: input.Date,
    Payee: input.Bénéficiaire,
    Memo: [input.Catégorie, input["Référence de paiement"]]
      .filter(Boolean)
      .join(": "),
    Inflow: value > 0 ? Math.abs(value).toString() : "",
    Outflow: value < 0 ? Math.abs(value).toString() : "",
  };
}

function postbank2Ynab(input: POSTBANK): YNAB {
  const value = parseFloat(
    input["Betrag (€)"].replace(/\./, "").replace(/,/, ".")
  );
  return {
    Date: input.Buchungsdatum,
    Payee: input.Empfänger,
    Memo: input.Buchungsdetails,
    Inflow: value > 0 ? Math.abs(value).toString() : "",
    Outflow: value < 0 ? Math.abs(value).toString() : "",
  };
}

function consors2Ynab(input: Consors): YNAB {
  const value = parseFloat(
    input["Betrag in EUR"].replace(/\./, "").replace(/,/, ".")
  );

  return {
    Date: input.Buchung
      ? dayjs(input.Buchung, "DD.MM.YYYY").format("YYYY-MM-DD")
      : "",
    Payee: input["Sender / Empfänger"],
    Memo: input.Verwendungszweck,
    Inflow: value > 0 ? Math.abs(value).toString() : "",
    Outflow: value < 0 ? Math.abs(value).toString() : "",
  };
}

function readFile(file: File, converter: CONVERTER): Promise<string> {
  return new Promise(function PromisifyReader(resolve, reject) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== "string") {
        reject("Could not read File");
        return;
      }
      resolve(e.target.result.replace(/^\ufeff/, ""));
    };
    reader.onerror = reject;

    reader.readAsText(
      file,
      converter === CONVERTER.POSTBANK ? "windows-1252" : undefined
    );
  });
}

async function convertFile(file: File, converter: CONVERTER) {
  const loadedFile = await readFile(file, converter);
  const rows = await neatCsv(loadedFile, {
    separator: converter === CONVERTER.N26 ? "," : ";",
    skipLines: converter === CONVERTER.POSTBANK ? 13 : 0,
  });

  let output;

  if (converter === CONVERTER.CONSORS) {
    output = rows.map((input) => consors2Ynab(input as Consors));
  }

  if (converter === CONVERTER.N26) {
    output = rows.map((input) => n262Ynab(input as N26));
  }

  if (converter === CONVERTER.POSTBANK) {
    output = rows.map((input) => postbank2Ynab(input as POSTBANK));
  }

  return createCsv(output, file.name);
}

export function useCSVConverter() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [converter, setConverter] = useState<CONVERTER>(CONVERTER.CONSORS);

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    convertFile(file, converter)
      .then(() => setLoading(false))
      .then(() => setFile(undefined));
  }, [setLoading, file, converter]);

  return {
    loading,
    setFile,
    setConverter,
  };
}
