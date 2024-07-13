const fs = require('fs');
const path = require('path');

// Function to validate email format
function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// Verify subdomain names match in both file name and in JSON content.
function verifySubdomainMatch(subdomain, filePath) {    
    const fileName = path.basename(filePath);
    const fileNameSubdomain = fileName.split('.')[0];
    // Check if the filename subdomain matches the provided subdomain
    if (fileNameSubdomain.toLowerCase() === subdomain.toLowerCase()) {
        return true;
    }
    return false;
}

function verifyFileFormat(fileName) {
    const pattern = /^(@|_dmarc|[a-zA-Z0-9\-]+|purelymail[1-3]\._domainkey)\.thedev\.me\.json$/; // Expression to validate file name.

    // Special cases that should bypass the 4-part check. Important for the main domain and for email support
    const specialCases = ["@", "_dmarc", "purelymail1._domainkey", "purelymail2._domainkey", "purelymail3._domainkey"];

    // Check if the file name matches any of the special cases
    for (let i = 0; i < specialCases.length; i++) {
        if (fileName.startsWith(specialCases[i] + ".thedev.me.json")) {
            return pattern.test(fileName);
        }
    }

    const fileNameParts = fileName.split('.');
    // Expecting exactly 4 chunks after splitting AND to match the expression
    if (fileNameParts.length !== 4 || !pattern.test(fileName)) {
        return false;
    }

    return true;
}

// Helper function to validate IP addresses
function isValidIP(ip) {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Pattern = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

// Helper function to validate domain names
function isValidDomain(domain) {
    const pattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    return pattern.test(domain);
}

// Function to validate the JSON data, returns array of errors or empty array if no errors
function validateJson(jsonData, filePath) {
    const errors = [];

    // Validate JSON name format (subdomainName.thedev.me.json)
    const fileName = path.basename(filePath);
    if (!verifyFileFormat(fileName)) {
        console.log(fileName)
        errors.push(`:ERROR: Only third-level domains are supported. Rename your JSON to this format: 'SUBDOMAIN.thedev.me.json'.`);
    }

    // Validate subdomain
    const subdomain = jsonData.subdomain || '';
    if (!subdomain) {
        errors.push(':ERROR: Subdomain is empty.'); 
    } else if (subdomain.includes('*')) {
        errors.push(':ERROR: Subdomain cannot contain wildcards.');
    } else {
        // Verify subdomain match
        if (!verifySubdomainMatch(subdomain, filePath)) {
            errors.push(':ERROR: Ensure the subdomain specified in the JSON file matches the subdomain present in the file name.');
        }
    }

    // Validate domain
    const domain = jsonData.domain || '';
    if (!domain || domain !== "thedev.me") {
        errors.push(':ERROR: Domain is invali d.'); 
    }

    // Validate public email
    const publicEmail = jsonData.public_email || '';
    if (!isValidEmail(publicEmail)) {
        errors.push(':ERROR: Invalid email structure.');
    }

    // Validate GitHub user
    const github_username = jsonData.github_username || '';
    if (!github_username ) {
        errors.push(':ERROR: Please provide your GitHub username in the JSON.');
    }

    // Validate description
    const description = jsonData.description || '';
    if (!description) {
        errors.push(':ERROR: Description is empty.');
    } else if (description.length < 15) {
        errors.push(':ERROR: Description is too short. Please provide a description of your website.');
    }

    // Validate records
    const records = jsonData.records || {};
    // Check typeof 
    if (typeof records !== 'object') {
        errors.push(':ERROR: Records must be an object.');
    } else {
        const validRecordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT'];

        for (const [type, values] of Object.entries(records)) {
            if (!validRecordTypes.includes(type)) {
                errors.push(`:ERROR: Invalid record type: ${type}`);
                continue;
            }
            // Verify that the values in records are arrays
            if (!Array.isArray(values)) {
                errors.push(`:ERROR: ${type} record must be an array. Check your JSON syntax.`);
                continue;
            }

            values.forEach((value) => {
                switch (type) {
                    // A check
                    case 'A':
                        if (!isValidIP(value) || value.includes(':')) {
                            errors.push(`:ERROR: Invalid A record (IPv4 expected): ${value}`);
                        }
                        break;
                    // AAAA check
                    case 'AAAA':
                        if (!isValidIP(value) || !value.includes(':')) {
                            errors.push(`:ERROR: Invalid AAAA record (IPv6 expected): ${value}`);
                        }
                        break;
                    // CNAME and MX check
                    case 'CNAME':
                    case 'MX':
                        if (!isValidDomain(value)) {
                            errors.push(`:ERROR: Invalid ${type} record: ${value}. Must be a valid domain. Remove 'http://' or 'https://', do not trail with '/'`);
                        }
                        break;
                    // TXT check
                    case 'TXT':
                        if (typeof value !== 'string') {
                            errors.push(`:ERROR: Invalid TXT record: ${value}`);
                        }
                        break;
                }
            });
        }
    }

    // Validate proxied field
    if (typeof jsonData.proxied !== 'boolean') {
        errors.push(':ERROR: Proxied field must be a boolean (true or false).');
    }

    return errors;
}

function main() {
    // An absolute path to the 'domains' directory for portability
    const domainsPath = path.join(__dirname, '..', 'domains');

    // Function to get all files in '../domains' and '../domains/reserved'
    function getAllFiles(dirPath) {
        let allFiles = [];

        // Read files in the main directory
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                allFiles.push(filePath); // Include files directly in the main directory
            }
        });

        // Check for and read 'reserved' subdirectory
        const reservedPath = path.join(dirPath, 'reserved');
        if (fs.existsSync(reservedPath) && fs.statSync(reservedPath).isDirectory()) {
            const reservedFiles = fs.readdirSync(reservedPath);
            reservedFiles.forEach(file => {
                const filePath = path.join(reservedPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    allFiles.push(filePath); // Include files in 'reserved' subdirectory
                }
            });
        }

        return allFiles;
    }  

    const allFiles = getAllFiles(domainsPath);    
    let allErrors = [];

    // Validate each JSON file
    allFiles.forEach(filePath => {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const errors = validateJson(jsonData, filePath);

        if (errors.length > 0) {
            allErrors = allErrors.concat(errors.map(error => `File: ${filePath} - ${error}`));
        }
    });

    // Print all errors and exit with an error code
    if (allErrors.length > 0) {
        console.error('Validation errors found:');
        allErrors.forEach(error => console.error(`- ${error}`));
        process.exit(1); // Exit with an error code
    } else {
        console.log('JSON files content is valid.');
    }
}

// Run the main function
main();
