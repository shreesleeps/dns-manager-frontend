export function isValidIPv4(address) {
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ipv4Regex.exec(address);
  if (!match) {
    return false; // Address does not match IPv4 format
  }
  // Check if each part of the address is within the valid range (0-255)
  for (let i = 1; i <= 4; i++) {
    const octet = parseInt(match[i], 10);
    if (isNaN(octet) || octet < 0 || octet > 255) {
      return false; // Octet is not a valid number or is out of range
    }
  }
  return true; // Address is a valid IPv4 address
}

export function isValidIPv6(address) {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(address);
}

export function isValidCNAME(value) {
  const domainRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/;
  return domainRegex.test(value);
}

export function isValidMX(value) {
  const mxRegex = /^(\d+)\s+(\S+)$/;
  const match = mxRegex.exec(value);
  if (!match) {
    return false; // Value does not match MX format
  }
  // Extract priority and mail server domain name from the value
  const priority = parseInt(match[1], 10);
  const mailServer = match[2];
  // Check if priority is a valid number and mail server is a valid domain name
  return !isNaN(priority) && isValidDomain(mailServer);
}

export function isValidDomain(domain) {
  const domainRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/;
  // Check if the provided domain name matches the domain regex pattern
  return domainRegex.test(domain);
}

export function isValidTXT(value) {
  return typeof value === "string" && value.trim() !== "";
}

export function isValidPTR(value) {
  return isValidDomain(value);
}

export function isValidSRV(value) {
  // Regular expression to validate SRV record value format
  const srvRegex =
    /^(\d+)\s+(\d+)\s+(\d+)\s+([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*)$/;
  // Check if the provided value matches the SRV regex pattern
  const match = srvRegex.exec(value);
  if (!match) {
    return false; // Value does not match SRV format
  }
  // Extract priority, weight, port, and target from the value
  const priority = parseInt(match[1], 10);
  const weight = parseInt(match[2], 10);
  const port = parseInt(match[3], 10);
  const target = match[4];
  // Check if priority, weight, and port are valid numbers
  return !isNaN(priority) && !isNaN(weight) && !isNaN(port);
}

export function isValidNS(value) {
  return isValidDomain(value);
}

export function isValidDS(value) {
  const dsRegex = /^\d+\s+\d+\s+\d+\s+[a-fA-F0-9]+$/;
  return dsRegex.test(value);
}
