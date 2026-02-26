{
    function extractSamLink(fpdsLink) {
        try {
            let urlObj = new URL(fpdsLink);
            let queryParams = new URLSearchParams(urlObj.search);
            
            if (queryParams.has('q')) {
                let searchTerm = queryParams.get('q');
                let piid = null;
                
                let match = searchTerm.match(/PIID\s*[:=]\s*"?([A-Za-z0-9\-]+)"?/i);
                
                if (match && match[1]) {
                    piid = match[1];
                } else {
                    let parts = searchTerm.trim().split(/\s+/);
                    if (parts.length > 0 && parts[0] !== "") {
                        piid = parts[0];
                    }
                }
                
                if (piid) {
                    let samParams = new URLSearchParams();
                    samParams.append('page', '1');
                    samParams.append('sfm[simpleSearch][keywordRadio]', 'ALL');
                    samParams.append('sfm[simpleSearch][keywordTags][0][key]', piid);
                    samParams.append('sfm[simpleSearch][keywordTags][0][value]', piid);
                    samParams.append('sfm[status][is_active]', 'true');
                    samParams.append('sfm[status][is_inactive]', 'true');
                    
                    let samUrl = `https://sam.gov/search/?${samParams.toString()}`;
                    return { piid: piid, samUrl: samUrl };
                }
            }
        } catch (error) {
            console.error("The provided string is not a valid URL.");
        }
        
        return null;
    }

    let linkToConvert = 'https://www.fpds.gov/ezsearch/search.do?s=FPDS&indexName=awardfull&templateName=1.5.3&q=N6264925FP020+9700+';
    let output = extractSamLink(linkToConvert);

    if (output) {
        console.log(`Found Contract Number: ${output.piid}`);
        console.log(`New SAM.gov Link: ${output.samUrl}`);
    } else {
        console.log("Could not locate a PIID in the provided link.");
    }
}
