import { Button, Dropdown, Input, Modal } from "antd";
import React, { useState } from "react";
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
import { createDNSRecordAPI } from "../../services/service";

export default function AddRecordModal({
  modalOpen,
  setModalOpen,
  selectedHostedZone,
  dNSRecords,
  afterAdd,
}) {
  const [recordName, setRecordName] = useState("");
  const [recordType, setRecordType] = useState({
    label: "A",
    key: "A",
    subReq: false,
    authFunc: isValidIPv4,
    eg: "192.0.2.146",
  });
  const [recordTTL, setRecordTTL] = useState("300");
  const [recordValue, setRecordValue] = useState("");

  const [changes, setChanges] = useState("");
  const [comment2, setComment2] = useState("");

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

  const createDNSRecord = async (payload) => {
    try {
      const response = await createDNSRecordAPI(payload);
      afterAdd();
      console.log("createDNSRecord successfull:", response);
    } catch (e) {
      console.log("createDNSRecord faliled:", e);
    }
  };

  const prepareBodyWithAuth = (
    subname,
    type,
    value,
    ttl,
    hz,
    authFun,
    subReq,
    dname
  ) => {
    let wM = "";

    const Name = subname + `${subname !== "" ? "." : ""}` + dname;
    const NameValidity = subReq ? (subname !== "" ? true : false) : true;
    const ValueValidity =
      value !== "" ? (authFun(value) ? true : false) : false;

    const NameAndTypeUniqueValidity = !dNSRecords.some(
      (objs) => objs.Name === Name && objs.Type === type
    );

    if (!NameValidity) {
      wM += "Sub Domain can't be empty; ";
    }
    if (!ValueValidity) {
      wM += "Invalid/Empty Value Format; ";
    }
    if (!NameAndTypeUniqueValidity) {
      wM += "Selected - (Domain Name + Type) already exists; ";
    }

    const payload = {
      changes: [
        {
          Action: "CREATE",
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

  return (
    <Modal
      title={<div>Create DNS Record</div>}
      open={modalOpen}
      onCancel={() => {
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
          <div>
            Sub Domain Name {recordType.subReq ? "(Required)" : "(Otional)"}
          </div>
          <Input
            status={recordType.subReq ? "warning" : undefined}
            placeholder={
              recordType.subReq ? "Sub Domain can't be empty" : "optional"
            }
            style={{ width: "100%" }}
            value={recordName}
            onChange={(e) => {
              setRecordName(e.target.value);
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Domain Name</div>
          <Input
            disabled
            placeholder="sub-domain"
            style={{ width: "100%" }}
            value={
              recordName +
              `${recordName !== "" ? "." : ""}` +
              selectedHostedZone.Name
            }
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Type (Required)</div>
          <Dropdown
            menu={{
              items: typeOptions.map((item) => {
                return { label: item.label, key: item.key };
              }),
              selectable: true,
              multiple: false,
              defaultSelectedKeys: ["A"],

              onSelect: (e) => {
                const findByKey = typeOptions.find((obj) => obj.key === e.key);
                setRecordType(findByKey);
              },
            }}
            trigger={["click"]}
          >
            <Button
              icon={<CaretDownFilled />}
              style={{
                width: "100%",
                textAlign: "left",
              }}
            >
              {recordType.key}
            </Button>
          </Dropdown>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            Value
            {recordValue !== ""
              ? recordType.authFunc(recordValue)
                ? ""
                : ` (not a valid ${recordType.key} DNS Record value)`
              : " (Required)"}
          </div>
          <Input
            status={
              recordValue !== ""
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
                recordType.authFunc,
                recordType.subReq,
                selectedHostedZone.Name
              );
              if (check.wM !== "") {
                setWarning(check.wM);
              } else {
                setWarning("");
                createDNSRecord(check.payload);
                setRecordName("");
                setRecordValue("");
                setRecordTTL("300");
                setModalOpen(false);
              }
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
