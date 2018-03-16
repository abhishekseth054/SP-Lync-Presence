 $(document).ready(function () {   
  		getAllTeamMembers(); 
    });   

	// I have taken the reference from codeplex 
	//	Ref - https://archive.codeplex.com/?p=splyncpresence
	
	// I have a list TestList and i have a column Person or group field named User.
	// I am getting the user email address and passing it to search query, to get the all required user information,
	
	// I tried to get user information from list itself and userphoto.aspx also but not getting account name and in my case we have so many differnet domain so formating the account name hardcoding  is also not working.so finally i call search query which is giving all the required information.
	
  	function getAllTeamMembers(){
  		var i = 0;  
        var listUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('TestList')/items";  
        var select = "?$select=User/EMail&$expand=User/Id";  
         
        $.ajax({  
            url: listUrl + select,  
            method: "GET",  
            headers: { "Accept": "application/json; odata=verbose" },  
            success: function (data) {  
                if (data.d != undefined) {  
                      
                    $.each(data.d.results, function (index, item) {    
                          
                        var eMail = item.User.EMail;              
 
 						var presence = lynPresence(eMail,true,'withpicture');
                       
                        $("#members").append(presence);   
                           
                        i++;  
                    });  
                }
                else{
                    $("#members").html("No Data Available !!");
                }
            },  
            error: function (xhr, ajaxOptions, thrownError) {  
                alert("POST error:\n" + xhr.status + "\n" + thrownError);  
            }  
        }); 
  	}
  
  
    //   call the function on a selector object
    //   accountName : 'DomainNam\\UserName' OR 'i:0%23.f|membership|username@domain.com'
    //   redirectToProfile : true/false --> true redirects to user page details
    //   type : default/withpicturesmall/withpicture/pictureonlysmall/pictureonly/presenceonly --> Use one option

  	function lynPresence(email, redirectToProfile, type){
        RegisterSod("Strings.js", "/_layouts/15/Strings.js");

        var name, title, sip, department, personalUrl, pictureUrl;
        
        var searchurl = _spPageContextInfo.webAbsoluteUrl + "/_api/search/query?querytext='"+ email +"'"
        
        $.ajax({
            url: searchurl,
            type: "GET",
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
            	
            	var results = data.d.query.SecondaryQueryResults.results[0].RelevantResults.Table.Rows.results[0].Cells.results;
            	
                 console.log(results);
                    $.each(results, function(key, value){
                    	
                    	if(value.Key == 'AccountName'){accountName = value.Value;}
                    	if(value.Key == 'Title'){name = value.Value; }
                    	if(value.Key == 'Title'){title= value.Value; }
                    	if(value.Key == 'SipAddress'){sip = value.Value;}
                    	if(value.Key == 'Department'){department= value.Value; }
                    	if(value.Key == 'OriginalPath'){personalUrl= value.Value; }
                    	if(value.Key == 'PictureURL'){pictureUrl= value.Value; }

                    });
            }
        });

        var uniqueID = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var html = '<p><div>';
        if (type == "default") {
            html += "<span class='ms-imnSpan'><a onmouseover='IMNShowOOUI();' onmouseout='IMNHideOOUI()'  href='" + personalUrl + "' class='ms-imnlink ms-spimn-presenceLink' ><span class='ms-spimn-presenceWrapper ms-imnImg ms-spimn-imgSize-10x10'><img name='imnmark' title='' ShowOfflinePawn='1' class='ms-spimn-img ms-spimn-presence-offline-10x10x32' src='/_layouts/15/images/spimn.png?rev=23' alt='User Presence' sip='" + sip + "' id='imn_" + uniqueID + ",type=sip' /></span>" + name + "</a></span>"
        }
        else if (type == "withpicturesmall") {
            pictureUrl += "&size=S";
            html += "<span class='ms-imnSpan ms-tableCell'><a onmouseover='IMNShowOOUI();' onmouseout='IMNHideOOUI()' style='padding: 0px;'><div class='ms-tableCell'><span class='ms-imnlink ms-spimn-presenceLink'><span class='ms-spimn-presenceWrapper ms-spimn-imgSize-5x36'><img name='imnmark' title='' showofflinepawn='1' class='ms-spimn-img ms-spimn-presence-offline-5x36x32' src='/_layouts/15/images/spimn.png' sip='" + sip + "' id='imn_" + uniqueID + ",type=sip' /></span></span></div><div class='ms-tableCell ms-verticalAlignTop'><div class='ms-peopleux-userImgDiv'><span><img title='' showofflinepawn='1' class='ms-hide' src='/_layouts/15/images/spimn.png' alt='Offline' sip='" + sip + "' /><span class='ms-peopleux-imgUserLink'><span class='ms-peopleux-userImgWrapper' style='width: 36px; height: 36px;'><img class='userIMG' style='width: 36px; height: 36px; clip: rect(0px, 36px, 36px, 0px);' src='" + pictureUrl + "' alt='" + name + "' /></span></span></span></div></div></a></span><div class='ms-tableCell ms-verticalAlignTop' style='padding-left: 10px;'><span><a href='" + personalUrl + "'>" + name + "</a></span><span style='font-size: 0.9em; display: block;'>" + title + "</span></div>";
        }
        else if (type == "withpicture") {
            html += "<span class='ms-imnSpan ms-tableCell'><a onmouseover='IMNShowOOUI();' onmouseout='IMNHideOOUI()' style='padding: 0px;'><div class='ms-tableCell'><span class='ms-imnlink ms-spimn-presenceLink'><span class='ms-spimn-presenceWrapper ms-spimn-imgSize-8x72'><img name='imnmark' title='' showofflinepawn='1' class='ms-spimn-img ms-spimn-presence-offline-8x72x32' src='/_layouts/15/images/spimn.png' sip='" + sip + "' id='imn_" + uniqueID + ",type=sip' /></span></span></div><div class='ms-tableCell ms-verticalAlignTop'><div class='ms-peopleux-userImgDiv'><span><img title='' showofflinepawn='1' class='ms-hide' src='/_layouts/15/images/spimn.png' alt='Offline' sip='" + sip + "' /><span class='ms-peopleux-imgUserLink'><span class='ms-peopleux-userImgWrapper' style='width: 72px; height: 72px;'><img class='userIMG' style='width: 72px; height: 72px; clip: rect(0px, 72px, 72px, 0px);' src='" + pictureUrl + "' alt='" + name + "' /></span></span></span></div></div></a></span><div class='ms-tableCell ms-verticalAlignTop' style='padding-left: 10px;'><span><a href='" + personalUrl + "'>" + name + "</a></span><span style='font-size: 0.9em; display: block;'>" + title + "</span><span style='font-size: 0.9em; display: block;'>" + department + "</span></div>";
        }
        else if (type == "pictureonlysmall") {
            pictureUrl += "&size=S";
            html += "<span class='ms-imnSpan ms-tableCell'><a onmouseover='IMNShowOOUI();' onmouseout='IMNHideOOUI()' style='padding: 0px;'><div class='ms-tableCell'><span class='ms-imnlink ms-spimn-presenceLink'><span class='ms-spimn-presenceWrapper ms-spimn-imgSize-5x36'><img name='imnmark' title='' showofflinepawn='1' class='ms-spimn-img ms-spimn-presence-offline-5x36x32' src='/_layouts/15/images/spimn.png' sip='" + sip + "' id='imn_" + uniqueID + ",type=sip' /></span></span></div><div class='ms-tableCell ms-verticalAlignTop'><div class='ms-peopleux-userImgDiv'><span><img title='' showofflinepawn='1' class='ms-hide' src='/_layouts/15/images/spimn.png' alt='Offline' sip='" + sip + "' /><span class='ms-peopleux-imgUserLink'><span class='ms-peopleux-userImgWrapper' style='width: 36px; height: 36px;'><img class='userIMG' style='width: 36px; height: 36px; clip: rect(0px, 36px, 36px, 0px);' src='" + pictureUrl + "' alt='" + name + "' /></span></span></span></div></div></a></span>";
        }
        else if (type == "pictureonly") {
            html += "<span class='ms-imnSpan ms-tableCell'><a onmouseover='IMNShowOOUI();' onmouseout='IMNHideOOUI()' style='padding: 0px;'><div class='ms-tableCell'><span class='ms-imnlink ms-spimn-presenceLink'><span class='ms-spimn-presenceWrapper ms-spimn-imgSize-8x72'><img name='imnmark' title='' showofflinepawn='1' class='ms-spimn-img ms-spimn-presence-offline-8x72x32' src='/_layouts/15/images/spimn.png' sip='" + sip + "' id='imn_" + uniqueID + ",type=sip' /></span></span></div><div class='ms-tableCell ms-verticalAlignTop'><div class='ms-peopleux-userImgDiv'><span><img title='' showofflinepawn='1' class='ms-hide' src='/_layouts/15/images/spimn.png' alt='Offline' sip='" + sip + "' /><span class='ms-peopleux-imgUserLink'><span class='ms-peopleux-userImgWrapper' style='width: 72px; height: 72px;'><img class='userIMG' style='width: 72px; height: 72px; clip: rect(0px, 72px, 72px, 0px);' src='" + pictureUrl + "' alt='" + name + "' /></span></span></span></div></div></a></span>";
        }
        else if (type == "presenceonly") {
            html += "<span class='ms-imnSpan'><a onmouseover='IMNShowOOUI();' onmouseout='IMNHideOOUI()'  href='" + personalUrl + "' class='ms-imnlink ms-spimn-presenceLink' ><span class='ms-spimn-presenceWrapper ms-imnImg ms-spimn-imgSize-10x10'><img name='imnmark' title='' ShowOfflinePawn='1' class='ms-spimn-img ms-spimn-presence-offline-10x10x32' src='/_layouts/15/images/spimn.png?rev=23' alt='User Presence' sip='" + sip + "' id='imn_" + uniqueID + ",type=sip' /></span></a></span>"
        }
        
        html += "</div></p>";
        
        setTimeout(ProcessImn, 10);
        return html;
    }

  


    
