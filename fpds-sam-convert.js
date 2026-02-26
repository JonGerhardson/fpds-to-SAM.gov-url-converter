{
    // Trigger a browser prompt to ask for the URL
    let userUrl = prompt("Paste your old FPDS URL (ezSearch or dbsight):");
    
    if (userUrl) {
        try {
            let urlObj = new URL(userUrl.trim());
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
                    
                    console.log(`✅ Found Contract Number: ${piid}`);
                    console.log(`🔗 New SAM.gov Link: ${samUrl}`);
                    
                    // Ask the user if they want to jump straight to the page
                    if (confirm(`Found Contract: ${piid}\n\nDo you want to open the SAM.gov search in a new tab right now?`)) {
                        window.open(samUrl, '_blank');
                    }
                } else {
                    alert("Could not locate a PIID in the provided link.");
                }
            } else {
                alert("Invalid FPDS URL format (missing the 'q' parameter).");
            }
        } catch (error) {
            alert("The provided string is not a valid URL.");
        }
    } else {
        console.log("Canceled: No URL entered.");
    }
}
