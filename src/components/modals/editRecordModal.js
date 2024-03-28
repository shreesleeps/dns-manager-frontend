import { Button, Dropdown, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  isValidIPv4,
  isValidCNAME,
  isValidIPv6,
  isValidMX,
  isValidTXT,
  isValidPTR,
  isValidSRV,
  isValidNS,
  isValidDS,
} from "../formatAuths";
import { CaretDownFilled } from "@ant-design/icons";
import { createDNSRecordAPI, updateDNSRecordAPI } from "../../services/service";

export default function EditRecordModal({
  modalOpen,
  setModalOpen,
  selectedHostedZone,
  selectedDNSRecords,
  afterAdd,
}) {
  const [recordName, setRecordName] = useState("");
  const [recordType, setRecordType] = useState({});
  const [recordTTL, setRecordTTL] = useState("300");
  const [recordValue, setRecordValue] = useState("");

  const [warning, setWarning] = useState("");

  const typeOptions = [
    {
      label: "A",
      key: "A",
      subReq: false,
      authFunc: isValidIPv4,
      eg: "192.0.2.146",
    },
    {
      label: "AAAA",
      key: "AAAA",
      subReq: false,
      authFunc: isValidIPv6,
      eg: "2001:db8:3333:4444:5555:6666:7777:8888",
    },
    {
      label: "CNAME",
      key: "CNAME",
      subReq: true,
      authFunc: isValidCNAME,
      eg: "www.example.com",
    },
    {
      label: "MX",
      key: "MX",
      subReq: false,
      authFunc: isValidMX,
      eg: "10 mailserver.example.com",
    },
    {
      label: "TXT",
      key: "TXT",
      subReq: false,
      authFunc: isValidTXT,
      eg: "Sample Text Entries",
    },
    {
      label: "PTR",
      key: "PTR",
      subReq: false,
      authFunc: isValidPTR,
      eg: "255.2.0.192.in-addr.arpa",
    },
    {
      label: "SRV",
      key: "SRV",
      subReq: false,
      authFunc: isValidSRV,
      eg: "10 5 5223 server.example.com",
    },
    {
      label: "NS",
      key: "NS",
      subReq: true,
      authFunc: isValidNS,
      eg: "ns1.example.com",
    },
    {
      label: "DS",
      key: "DS",
      subReq: true,
      authFunc: isValidDS,
      eg: "12345 3 1 123456789abcdef67890123456789abcdef67890",
    },
  ];

  const updateDNSRecord = async (payload) => {
    try {
      const response = await updateDNSRecordAPI(payload);
      afterAdd();
      console.log("updateDNSRecord successfull:", response);
    } catch (e) {
      console.log("updateDNSRecord faliled:", e);
    }
  };

  const prepareBodyWithAuth = (name, type, value, ttl, hz, authFun) => {
    let wM = "";

    const Name = name;
    const ValueValidity =
      value !== "" ? (authFun(value) ? true : false) : false;

    if (!ValueValidity) {
      wM += "Invalid/Empty Value Format; ";
    }

    const payload = {
      changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: Name,
            ResourceRecords: [
              {
                Value: value,
              },
            ],
            TTL: ttl,
            Type: type,
          },
        },
      ],
      comment: "",
      hostedZoneId: hz,
    };

    return {
      wM: wM,
      payload: payload,
    };
  };

  useEffect(() => {
    if (selectedDNSRecords.length === 1) {
      const selected = selectedDNSRecords[0];

      setRecordName(selected.Name);
      const matchingObj = typeOptions.find((obj) => obj.key === selected.Type);
      setRecordType(matchingObj);
      setRecordValue(selected.ResourceRecords[0].Value);
      setRecordTTL(selected.TTL);
      console.log("selected", matchingObj);
    } else {
      setRecordName("");
      setRecordType({
        label: "",
        key: "",
        subReq: false,
        authFunc: () => {},
        eg: "",
      });
      setRecordTTL("");
    }
  }, [selectedDNSRecords]);

  return (
    <Modal
      title={<div>Edit DNS Record</div>}
      open={modalOpen}
      onCancel={(e) => {
        console.log(e);
        setModalOpen(false);
      }}
      footer={<></>}
      centered
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Domain Name</div>
          <Input disabled style={{ width: "100%" }} value={recordName} />
        </div>{" "}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Type</div>
          <Input disabled style={{ width: "100%" }} value={recordType.key} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            Value
            {recordValue !== "" && Object.keys(recordType).length
              ? recordType.authFunc(recordValue)
                ? undefined
                : ` (not a valid ${recordType.key} DNS Record value)`
              : " (Required)"}
          </div>
          <Input
            status={
              recordValue !== "" && Object.keys(recordType).length
                ? recordType.authFunc(recordValue)
                  ? undefined
                  : "error"
                : "warning"
            }
            placeholder={recordType.eg}
            style={{ width: "100%" }}
            value={recordValue}
            onChange={(e) => {
              setRecordValue(e.target.value);
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>TTL (Required)</div>
          <Input
            type="number"
            placeholder="TTL"
            style={{ width: "100%" }}
            value={recordTTL}
            onChange={(e) => {
              setRecordTTL(e.target.value);
            }}
          />
        </div>
        <div style={{ color: "red", fontSize: "12px" }}>{warning} </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <Button
            onClick={() => {
              const check = prepareBodyWithAuth(
                recordName,
                recordType.key,
                recordValue,
                recordTTL,
                selectedHostedZone.Id,
                recordType.authFunc
              );
              if (check.wM !== "") {
                setWarning(check.wM);
              } else {
                setWarning("");
                updateDNSRecord(check.payload);
              }
              setModalOpen(false);
            }}
            type="primary"
          >
            Create
          </Button>
          <Button
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
