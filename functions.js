
async function loadPages(){
  $("#heading").load("./HtmlPages/heading.html", function(){
    console.log("heading loaded");
    //if (localStorage.getItem("lang")!=null) setLang(localStorage.getItem("lang"));
  });           

  $("#sidebar").load("./HtmlPages/sidebar.html", function(){
    console.log("sidebar loaded");
    $("#sidebar-contacts").addClass("active");
    $("#ml-Sidebar-check-users").css("color", "#FBF279");       
    //if (localStorage.getItem("lang")!=null) setLang(localStorage.getItem("lang"));      

    //$("#sidebar-check-expirations").hide(); //disable check expirarion function
  });

//  $("#checkin-page").load("./HtmlPages/checkinPage.html", function(){
//    console.log("checkin-page loaded");
//    //show_checkin_page();
//    //if (localStorage.getItem("lang")!=null) setLang(localStorage.getItem("lang"));          
//  });
    
  $("#user-page").load("./HtmlPages/userPage.html", function(){
    console.log("user-page loaded");
    readUserDB();
    //rsvCheck();
    userData_is_loaded = true;
      
    show_user_page();
    //if (localStorage.getItem("lang")!=null) setLang(localStorage.getItem("lang"));          
  });
}

function show_checkin_page(){
  $(".page-wrapper").hide(); // hide all pages with page-wrapper class
  $(".sidebar-item").css("color","white")

  $("#checkin-page").show(); 
  $("#ml-Sidebar-checkin").css("color", "#FBF279");          

}

function show_user_page(){
  $(".page-wrapper").hide(); // hide all pages with page-wrapper class
  $(".sidebar-item").css("color","white")

  $("#user-page").show(); 
  $("#ml-Sidebar-check-users").css("color", "#FBF279");
           
  if (!userData_is_loaded) {
    readUserDB();
    userData_is_loaded = true;     
  }
}

function readUserDB(){ 
  
  var test_delete=[];
  
  console.log("Reading userData");
  $.loading.start($("#ml-讀取用戶資料").text());
  fetch('http://127.0.0.1:8000?API=00')
  .then((response) => response.json())
  .then((data) => {
    users=data;
    userResult=[];
  
    test_delete=data.shift();
    
    for (var i=0; i < data.length; i++){
      if (!test_delete.includes(i.toString())) {
        var user=[];
        user.push(data[i].id);
        user.push(data[i].name);
        user.push(data[i].birth);
        user.push(data[i].phone);
        user.push(data[i].others);
        user.push(i); // i is the original index of all users include deleted ones

        userResult.push(user);
      }
    }
 
    userDataTable.clear();
    userDataTable.rows.add(userResult).draw();
    
    $.loading.end()
  })
  .catch((error) => console.log(error));
}    

function readDataDB(){ //by API
  //TO BE IMPLEMENTED
  console.log("Reading data database...");
} 

function rsvCheck(){
  var startDateStr = $("#rsvQueryStartDate").val();
  var endDateStr = $("#rsvQueryEndDate").val();

  //console.log(startDateStr, endDateStr);

  var apiUrl = apiUrlBase + "?API=00" + "&StartDate=" + startDateStr +"&EndDate=" + endDateStr;

  //console.log(apiUrl);

  $.loading.start($("#ml-讀取資料").text());
  $.ajax({
    url: apiUrl,
    type: "GET",
    dataType: "json",
    success: function(returnData) {
      //returnFromAPI = JSON.parse(JSON.stringify(returnData));
      //console.log(returnFromAPI[0][3]);

      rsvResult = returnData;

      for (i=0; i< rsvResult.length; i++){
        rsvResult[i][4] = rsvResult[i][3].substr(11,5)+'~'+rsvResult[i][4].substr(11,5);
        rsvResult[i][3] = rsvResult[i][3].substr(0,10);
      }


      rsvDataTable.clear();
      rsvDataTable.rows.add(rsvResult).draw();
      $.loading.end();
      //$("#ml-Sidebar-check-reservations").css("color", "#FBF279");                
      //$("#sidebar-check-reservations-icon").css("color", "#FBF279");                
    },

    error: function() {
      alert("Database READ ERROR!!!");
    }
  });             
}

// 定義以下 array 的 count function，就可以使用 [1, 2, 3, 5, 2, 8, 9, 2].count(2) => 3
Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.filter(x => x==value).length;
        }
    }
});

// 定義以下 array 的 less function，就可以使用 [1, 2, 3, 5, 2, 8, 9, 2].less(5) => 5
Object.defineProperties(Array.prototype, {
    less: {
        value: function(value) {
            return this.filter(x => x<value).length;
        }
    }
});

// 定義以下 array 的 sum function，就可以使用 [1, 2, 3, 5, 2, 8, 9, 2].sum() => 32
Object.defineProperties(Array.prototype, {
    sum: {
        value: function(value) {
            let sum =0;
            for (var i=0; i<this.length;i++){
              sum += this[i];
            }
            return sum;
        }
    }
});

function cnvtDatetime2ToString(dateTime2, method, type){
  if( type=="date"){
    if ( (method == "指紋打卡") || (method == "手動修改")  ) {
      var tmp=  new Date(dateTime2);
      var tmpStr=tmp.toLocaleDateString().replace(/\//ig,'-')
      // 修改 2021-1-1 ==> 2021-01-01
      var tmpArr = tmpStr.split('-');
      if (tmpArr[1].length==1) tmpArr[1] ="0"+tmpArr[1];
      if (tmpArr[2].length==1) tmpArr[2] ="0"+tmpArr[2];
      
      return tmpArr[0]+'-'+tmpArr[1]+'-'+tmpArr[2];    
    } else {
      return dateTime2.toString().substr(0,10);
    }    
  }
  
  if (type=="time"){
    if (dateTime2.toString().substr(-13,13) == '00:00:00.000Z') return '';
    //if (dateTime2.toString().substr(0,10) == '0001-01-01') return '';

    if ( (method == "指紋打卡") || (method == "手動修改")  ) {
      var tmp=  new Date(dateTime2);
      return tmp.toTimeString().substr(0,8);    
    } else {
      return dateTime2.toString().substr(11,8);
    }
  }
  
}

function clearDateTime(item) {
  console.log(item);
  var itemName = "#"+item;
  $(itemName).val('');
}