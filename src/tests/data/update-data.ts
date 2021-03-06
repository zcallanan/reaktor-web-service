import createResponse from "../../shared/create-response";
import { ProductItemRaw, ProductAPIRes, ManAPIRes } from "../../types";

const updateData: ProductItemRaw[] = [
  {
    id: "01fe877cbe49cd19a45a",
    name: "OOTGINKOL ANIMAL UPDATED",
    type: "facemasks",
    manufacturer: "hennex",
    color: ["black", "blue"],
    price: 100,
  },
  {
    id: "077a1b3093954816e5fd",
    name: "NYYYOOT RAIN",
    type: "facemasks",
    manufacturer: "abiplos",
    color: ["green"],
    price: 79,
  },
];

const hennexData: ManAPIRes = {
  code: 200,
  response: [
    {
      id: "01FE877CBE49CD19A45A",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>LESSTHAN10</INSTOCKVALUE>\n</AVAILABILITY>",
    },
  ],
};

const abiFData: ManAPIRes = {
  code: 200,
  response: [
    {
      id: "077A1B3093954816E5FD",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
    },
  ],
};

const updateRes: ProductAPIRes = {
  facemasks: createResponse(updateData, "Less Than 10", "Out of Stock"),
};

export {
  updateData,
  updateRes,
  hennexData,
  abiFData,
};
