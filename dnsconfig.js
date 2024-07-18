var REG_NONE = NewRegistrar("none");
var DNS_BIND = NewDnsProvider("cloudflare");
var DOMAIN_NAME = "thedev.me"

function createSubdomainsObject(jsonsPath) {
  var domains = [];
  try {
    // Use glob to get JSONs name as a directory
    // Works recursively, so subfolders are included
    var jsons = glob.apply(null, [jsonsPath, true, ".json"]);

    // Push each JSON into 'domains'
    for (var i = 0; i < jsons.length; i++) {
      try {
        domains.push({ data: require(jsons[i]) });
      } catch (e) {
        console.error(":ERROR: Error loading JSON file:", jsons[i], e);
      }
    }
  } catch (e) {
    console.error(":ERROR: Error finding JSON files in directory (or one of its subs) :", jsonsPath, e);
  }

  return domains;
}

// Create an object of all JSONs
var subdomains = createSubdomainsObject('./domains')

var records = [];
// Parse all JSON files and generate DNS resource records for DNSControl
for (var i = 0; i < subdomains.length; i++) {
  var subdomainData = subdomains[i].data
  var subdomain = subdomainData.subdomain
  var proxy = subdomainData.proxied ? { "cloudflare_proxy": "on" } : { "cloudflare_proxy": "off" };

  // A Records
  if (subdomainData.records.A) {
    for (var ipv4 in subdomainData.records.A) {
      records.push(A(subdomain, subdomainData.records.A[ipv4], proxy));
    }
  }
  // AAAA Records
  if (subdomainData.records.AAAA) {
    for (var ipv6 in subdomainData.records.AAAA) {
      records.push(AAAA(subdomain, subdomainData.records.AAAA[ipv6], proxy));
    }
  }
  // CNAME Records
  if (subdomainData.records.CNAME) {
      records.push(CNAME(subdomain, subdomainData.records.CNAME + ".", proxy));
  }
  // NS Records
  if (subdomainData.records.NS) {
    for (var ns in subdomainData.records.NS) {
      records.push(NS(subdomain, subdomainData.records.NS[ns] + ".", proxy));
    }
  }
  // MX Records
  if (subdomainData.records.MX) {
    for (var mx in subdomainData.records.MX) {
      records.push(MX(subdomain, 20, subdomainData.records.MX[mx] + "."));
    }
  }
  // TXT Records
  if (subdomainData.records.TXT) {
    for (var txt in subdomainData.records.TXT) {
      records.push(TXT(subdomain, subdomainData.records.TXT[txt]));
    }
  }
}

// Create DNS entries using DNSControl's D() function
D(DOMAIN_NAME, REG_NONE, DnsProvider(DNS_BIND), records);
