import React, { ChangeEvent, FormEvent, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/core";
import { CONVERTER, useCSVConverter } from "../utils/useCSVConverter";

export default function YNABConverter(): React.ReactElement {
  const fileInput = useRef<HTMLInputElement>(null);
  const { loading, setFile, setConverter } = useCSVConverter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !fileInput.current ||
      !fileInput.current.files ||
      fileInput.current.files.length === 0
    )
      return;
    setFile(fileInput.current.files[0]);
  }

  function handleConverterChange(e: ChangeEvent<HTMLSelectElement>) {
    if (!e.target) return;

    switch (e.target.options[e.target.selectedIndex].value) {
      case CONVERTER.CONSORS:
        setConverter(CONVERTER.CONSORS);
        break;
      case CONVERTER.N26:
        setConverter(CONVERTER.N26);
        break;
    }
  }

  return (
    <Box w="100%" maxWidth="720px" px="16px" mx="auto">
      <Text>Load the csv for converting for YNAB.</Text>
      <form onSubmit={handleSubmit} method="POST">
        <FormControl marginBottom="8px" display="flex" flexDirection="column">
          <FormLabel>File (*.csv)</FormLabel>
          <Input
            type="file"
            accept=".csv"
            aria-describedby="Upload csv file to convert"
            ref={fileInput}
            width="auto"
          />
        </FormControl>
        <FormControl marginBottom="16px">
          <FormLabel>Converter</FormLabel>
          <Select
            placeholder="Choose a converter"
            onChange={handleConverterChange}
            defaultValue={CONVERTER.CONSORS}
          >
            <option value={CONVERTER.CONSORS}>Consors</option>
            <option value={CONVERTER.N26}>N26</option>
          </Select>
        </FormControl>
        <Box width="100%" textAlign="right">
          <Button
            isLoading={loading}
            variant="solid"
            variantColor="teal"
            type="submit"
          >
            Send
          </Button>
        </Box>
      </form>
    </Box>
  );
}
