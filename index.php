<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <!-- This meta tag specifies the character encoding for the document -->
    <script async="" src="js.html"></script>
    <script>
    window.dataLayer = window.dataLayer || []; // Initialize dataLayer array

    function gtag() {
        dataLayer.push(arguments); // Function to push data to dataLayer
    }
    gtag('js', new Date()); // Initialize gtag with current date

    gtag('config', 'G-RW61J2PCZ1'); // Configuration for Google Analytics tracking ID
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="main/page/new.html">

    <title>Utkarsh Suryaman</title>

    <meta property="og:url" content="main/page/new.html">
    <meta property="og:title" class="notranslate" content="Utkarsh Suryaman">
    <meta property="og:type" content="website">
    <meta property="og:description" class="notranslate" content="https://cse.iitrpr.ac.in/">
    <meta property="og:image" content="">
    

    <link rel="apple-touch-icon image_src" href="" type="image/x-icon">

    <title class="notranslate">Utkarsh_IIT_Ropar</title>
    <meta name="description" content="IIT Ropar">
     

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="index.css">
   <!-- <link rel="stylesheet" href="style1.css" as="style"> -->
    <link rel="stylesheet" href="card_style.css" as="style">
    <link rel="stylesheet" href= "lightbox.css" as="style">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.11.0/dist/sweetalert2.min.css">

    <link rel="preconnect" href="https://fonts.googleapis.com/">
    <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">
    <!-- Swiper CSS -->
    <link rel="stylesheet" href=https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css>
    <!-- JavaScript variables for CDN URLs -->
    <script>
       const __LAST_UPDATE_TIMESTAMP = "1715335332b";
    </script>
    <script>
       const __CDN_URL = "C:\\Users\\Acer\\Desktop\\stackdev\\www.qrcodechimp.com\\cdn0070.qrcodechimp.com";
       const __CDN_ASSET_URL = "C:\\Users\\Acer\\Desktop\\stackdev\\www.qrcodechimp.com\\cdn0030.qrcodechimp.com";
    </script>
<?php
// Database credentials
$hostname = "localhost";
$dbUser = "root";
$dbPass = "";
$dbName = "portfolio";

// Create connection
$conn = mysqli_connect($hostname, $dbUser, $dbPass, $dbName);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// SQL query to fetch data
$sql = "SELECT * FROM data";
$result = mysqli_query($conn, $sql);

// HTML output
?>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.no-scroll-y {
  overflow-y: hidden;
}

/* Preloader */
.ctn-preloader {
  align-items: center;
  cursor: none;
  display: flex;
  height: 100%;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 900;
}

.ctn-preloader .animation-preloader {
  position: absolute;
  z-index: 100;
}

/* Spinner cargando */
.ctn-preloader .animation-preloader .spinner {
  animation: spinner 1s infinite linear;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-top-color: #000000; /* No se identa por orden alfabetico para que no lo sobre-escriba */
  height: 9em;
  margin: 0 auto 3.5em auto;
  width: 9em;
}

/* Texto cargando */
.ctn-preloader .animation-preloader .txt-loading {
  font: bold 5em 'Montserrat', sans-serif;
  text-align: center;
  user-select: none;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:before {
  animation: letters-loading 4s infinite;
  color: #000000;
  content: attr(data-text-preloader);
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  transform: rotateY(-90deg);
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading {
  color: rgba(0, 0, 0, 0.2);
  position: relative;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(2):before {
  animation-delay: 0.2s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(3):before {
  animation-delay: 0.4s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(4):before {
  animation-delay: 0.6s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(5):before {
  animation-delay: 0.8s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(6):before {
  animation-delay: 1s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(7):before {
  animation-delay: 1.2s;
}

.ctn-preloader .loader-section {
  background-color: #beffc6;
  height: 100%;
  position: fixed;
  top: 0;
  width: calc(50% + 1px);
}

.ctn-preloader .loader-section.section-left {
  left: 0;
}

.ctn-preloader .loader-section.section-right {
  right: 0;
}

/* Efecto de fade en la animación de cargando */
.loaded .animation-preloader {
  opacity: 0;
  transition: 0.3s ease-out;
}

/* Efecto de cortina */
.loaded .loader-section.section-left {
  transform: translateX(-101%);
  transition: 0.7s 0.3s all cubic-bezier(0.1, 0.1, 0.1, 1.000);
}

.loaded .loader-section.section-right {
  transform: translateX(101%);
  transition: 0.7s 0.3s all cubic-bezier(0.1, 0.1, 0.1, 1.000);
}

/* Animación del preloader */
@keyframes spinner {
  to {
    transform: rotateZ(360deg);
  }
}

/* Animación de las letras cargando del preloader */
@keyframes letters-loading {
  0%,
  75%,
  100% {
    opacity: 0;
    transform: rotateY(-90deg);
  }

  25%,
  50% {
    opacity: 1;
    transform: rotateY(0deg);
  }
}

/* Tamaño de portatil hacia atras (portatil, tablet, celular) */
@media screen and (max-width: 767px) {
  /* Preloader */
  /* Spinner cargando */  
  .ctn-preloader .animation-preloader .spinner {
    height: 8em;
    width: 8em;
  }

  /* Texto cargando */
  .ctn-preloader .animation-preloader .txt-loading {
    font: bold 3.5em 'Montserrat', sans-serif;
  }
}

@media screen and (max-width: 500px) {
  /* Prelaoder */
  /* Spinner cargando */
  .ctn-preloader .animation-preloader .spinner {
    height: 7em;
    width: 7em;
  }

  /* Texto cargando */
  .ctn-preloader .animation-preloader .txt-loading {
    font: bold 2em 'Montserrat', sans-serif;
  }
}
</style>

<style> :root {--qrc-secondary: #31cf41;} </style>
<link rel="manifest" href="manifest.json">
    <style>
        /* Optional: Add your custom styles here */
        .install-popup {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }
        .install-popup h3 {
            margin-top: 0;
        }
        .install-popup button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .install-popup button:hover {
            background-color: #45a049;
        }
    </style>       
           
<style>
    :root {
        --qrc-primary: #22ff00;
        --qrc-secondary: #96e7a0;
        --qrc-text-primary: #333333;
        --qrc-text-secondary: #76839b;
        --qrc-profile-primary: #333333;
        --qrc-profile-secondary: #76839b;
        --qrc-card-bg: #e8f9e4;
        --qrc-border-radius: 16px;
        --qrc-box-shadow: 0px 7px 29px 0px #ff573333;
    }
    .qr_cc_card {
        background-color: var(--qrc-card-bg);
        border-radius: var(--qrc-border-radius);
        box-shadow: var(--qrc-box-shadow);
    }
</style>




<style>body{overflow:auto !important;}
         .qrc_profile_5{ border-radius: 18px; overflow: hidden; margin: 15px 0;}
         .qrc_profile_5 h2{text-shadow: 2px 2px 3px rgba(0,0,0,0.3); color: var(--qrc-profile-primary); font-size: 28px; line-height:30px; word-break: break-word; font-weight: 500;}
         .qrc_profile_5 p{color: var(--qrc-profile-primary); margin-bottom:0px}
         .qrc_profile_5 .qrc_profile_inner{ padding-top: 0; position: relative;  height: 180px; color: var(--qrc-profile-primary); border-radius: var(--qrc-border-radius); 
             overflow: hidden; background: var(--qrc-secondary); display: flex;
             align-items: center;}
         .qrc_profile_5 .qrc_profilepic{height: 180px; width: 130px; border-radius: 0; flex-shrink:0;}
         .qrc_profile_5_svg{position: absolute; bottom: 129px;}
         .qrc_profile_5_ovrlay_svg{position: absolute; bottom: 150px;}
         .qrc_profile_5 .qrc_profile_inner_info{margin-top:unset;}
         .qrc_profilepic{background-position: top center; margin:unset; }
         .qrc_profile_shortcut{background: var(--qrc-primary); border-radius: var(--qrc-border-radius); width: 100%;margin: 15px 0 0 0; padding: 10px 5px 5px 10px; text-align: center;}
         .qrc_profile_shortcut ul li{text-align: center; background: var(--qrc-primary); color: #fff;
             width: 42px;
             height: 42px;
             font-size: 26px;
             padding-top: 0px;     margin-bottom: 8px;    border: solid 1px #fff;}
             .qrc_profile_shortcut ul li a{padding: 10px; color:#fff;}
         .qrc_profile_shortcut ul li a:hover{color: #fff;}
         .qrc_gallery_list li{padding-top: 0px;}
         .qrc_page_wrapper{background-position: top center; background-size: cover;height:unset; min-height:100vh; background-color:var(--qrc-profile-secondary);}
         .qrc_profile_brand_logo{
             width: 200px;
             margin: 80px auto 80px auto;
             text-align: center;  
         }
         .qrc_profile_brand_logo img{max-width: 200px; max-height: 100px;}
         
         .qrc_social_text_heading, .qrc_contact_hdr_text, .qrc_contact_info_title, .qrc_email_info_title, .qrc_address_info_title, .qrc_heading h2{color: var(--qrc-text-primary);}
         
         
         .qrc_addtocontact_circle{width: 42px; height: 42px;}
         .qrc_page_qrcode, .qrc_page_share{color:#fff;width:58px; height:58px; display: flex; justify-content: center;   align-items: center; position: fixed; bottom: 15px; left: 15px; z-index: 9; background: var(--qrc-primary); padding: 8px; border-radius: 52px; box-shadow: rgb(100 100 111 / 20%) 0px 7px 29px 0px; border: solid 1px #ffffff20;}
         .qrc_page_share{bottom: 15px; left: 80px;}
         .qrc_page_qrcode:hover, .qrc_page_share:hover{color:#fff;}
         .qrc_page_qrcode span, .qrc_page_share span{font-size: 24px;}
        
         .qrc_page_inner{padding-top:15px}
         
         
         @media (max-width: 767px) {
             .qrc_profile_5 { border-radius: 0px !important; margin-top:0; margin-bottom: 0px;}
             body::-webkit-scrollbar { display: none;}
             body { -ms-overflow-style: none;  scrollbar-width: none;}
         }</style>
         
         
         <script type="text/javascript" src="jquery-slim.min.js"></script>
        <script type="text/javascript" src="html2canvas.min.js"></script>
        <script type="text/javascript" src="fileSaver.js"></script> 
        <script type="text/javascript" src="sweetalert2.all.min.js"></script> 
            <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
            <script type="text/javascript" src="lightbox-plus-jquery.js"></script>
            <script type = "text/javascript" src ="qrPageComponents.js?v=1715335332b"></script>
            <script type = "text/javascript" src ="app.js"></script>
            
      
                        
            <script>
    // let scriptPaths = ["/assets/js/html2canvas.min.js", "/assets/js/base64.js", "/assets/svg/lib/qrcode.js", "/assets/svg/lib/qr-options-common.js", "/assets/svg/lib/qrcode-ext.js", "/assets/svg/lib/qr-options-actions.js"];
    let scriptPaths = `/files?l=html2canvas.min.js,base64.js;/assets/svg/lib/qrcode.js,qr-options-common.js,qrcode-ext.js,qr-options-conf.js,qr-options-display.js,qr-options-actions.js&v=` +
                      new Date().getTime();
    
    scriptPaths.split(',').forEach(scriptPath => {
        let script = document.createElement("script");
        script.src = wrapperUrlWithCdn(scriptPath.trim());
        script.onload = function() {
            createQRCodeWithoutDom(__savedQrCodeOptions);
        };
        document.body.append(script);
    });
</script>     
                        
<script>      
            $(".qr_page_loader").show();;$(".qrc_page_wrapper").hide()


            $(".qrc_addtocontact").on("click", function(e){
            e.preventDefault();
            if(window.self !== window.top) {
                return;
            }

            // Define the URL of the file to be downloaded
            let fileUrl = 'UtkarshSuryaman.vcf'; // Replace with your .vcf file URL
            let fileName = 'UtkarshSuryaman.vcf'; // Replace with your desired file name

            // Create a temporary anchor element
            let a = document.createElement('a');
            a.href = fileUrl;
            a.download = fileName;

            // Append the anchor to the body
            document.body.appendChild(a);

            // Trigger the download by simulating a click
            a.click();

            // Remove the anchor from the document
            document.body.removeChild(a);
        })
                            
                            $(document).on("click", "#btn_page_qr_code", function(e){
                                $(".qrc_addtohome_info").hide()
                                $("body").addClass("hideoverflow");
                                $('.qrc_addtohomescreen').show()
                                $("#qrc_page_qrcode_popup").addClass("show")
                            })
                            $(document).on("click", ".qrc_button_submit", function(e){
                            e.preventDefault()
                            ComponentLists.forms.validateForm(this)
                         })
                         $(document).on("click", ".resend_otp", function(e){
                            e.preventDefault()
                            ComponentLists.forms.triggerOTP()
                         })
                         $(document).on("click", ".change_number", function(e){
                            e.preventDefault()
                            ComponentLists.forms.goBack(this)
                         })

                         
                         
                         $(document).on("click", "#btn_share_page", function(e) {e.preventDefault();
    
                            if (navigator.share && isMobile.any()) {
                                        navigator.share({
                                         title: document.title,
                                         url: 'http://localhost/fetchdata/'
                                                }).then(() => {
                                             SwalPopup.showSingleButtonPopup({
                                                         icon: "success",
                                                             text: 'Thanks for sharing!',
                                                        confirmButtonText: 'Close'
                                                          });
                                                }).catch((error) => {
                                           console.error('Error sharing:', error);
                                             });
                                              } else {
                                        console.log('Web Share API is not supported in your browser.');
                                               }
                                       });


                            
                            $(document).on("click", "#btn_page_qr_code_close", function(e){
                                $("#qrc_page_qrcode_popup").removeClass("show")
                                $("body").removeClass("hideoverflow");
                                
                            })

                            $(document).on("click", ".qrc_ticket_lock", function(e){
                                showLockQRCodePopup()
                                $(".qrc_ticket_lock").hide()
                            })

                            function handleHoursToggle(el) {
                                let ele = $('.qrc_business_hours_body');
                                if(ele.hasClass("business_hours_hide")){
                                    // icon-uparrow_4
                                    $(el).removeClass("icon-downarrow_4").addClass("icon-uparrow_4");
                                    ele.removeClass("business_hours_hide").addClass("business_hours_show");
                                }else{
                                    $(el).removeClass("icon-uparrow_4").addClass("icon-downarrow_4");
                                    ele.removeClass("business_hours_show").addClass("business_hours_hide");
                                }
                            }

            

                            function showLockQRCodePopup() {
                                Swal.fire({ 
                                    html: `<div>
                                            
                                            <h3></h3>
                                            <p></p>
                                        </div>`, 
                                    showConfirmButton: false, 
                                    showCloseButton: true, 
                                    closeButtonHtml: `<i class="icon-remove_1" style="color:black;border:1px solid #C2C6D9; border-radius:50%; font-size:30px" ></i>`,
                                    onClose : () => {
                                        $(".qrc_ticket_lock").show()
                                    }
                                });
                            }

                            function pageInit(lock){
                                setTimeout(function() {
                                    $(".qr_page_loader").hide()
                                    $(".qrc_ticket_lock").hide()
                                    if(!lock){
                                        $(".qrc_page_wrapper").show();
                                        var swiper = new Swiper(".mySwiper", {
                                            pagination: {
                                              el: ".swiper-pagination",
                                            },
                                        });
                                        document.querySelector(".qrc_page_wrapper")?document.querySelector(".qrc_page_wrapper").scrollIntoView():null
                                        
                                    }else{
                                        $(".qrc_lock_screen").show()
                                    }
                                    if(window.self !== window.top)
                                    {
                                        setTimeout(function() {
                                            $(document.body).find(".qrc_page_wrapper").scrollTop(0)
                                            // document.body.children[2].scrollBy(0,0);
                                        }, 100)
                                    }
                                    
                                }, 1000)
                            }
                            
                            $.post("openapi.html", {cmd : 'logScan' , path : location.pathname, same_window : window.self !== window.top?1:0} , function(response){
                                let lock_tag = response.errorCode;
                                pageInit(lock_tag)
                            })
                            
                           $(document).ready(()=>{ setTimeout (() => { QRPageComponents.getAddToHomeScreenListenserFunctions() }) })
            </script>


<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css">
    <style>
        /* Custom styles for image viewer */
        .lightboxContainer {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }
        .lightboxContainer img {
            max-width: 100%;
            height: auto;
        }
        .prev, .next {
            cursor: pointer;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 24px;
            background-color: rgba(255, 255, 255, 0.5);
            padding: 10px;
            border-radius: 50%;
        }
        .prev {
            left: 10px;
        }
        .next {
            right: 10px;
        }
    </style>
                       
</head>

  <body class="no-scroll-y"  style="margin : 0, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;">  
                
                <!-- Preloader -->
       <section>
                  <div id="preloader">
                    <div id="ctn-preloader" class="ctn-preloader">
                      <div class="animation-preloader">
                        <div class="spinner"></div>
                        <div class="txt-loading">
                          <span data-text-preloader="L" class="letters-loading">L</span>
                          <span data-text-preloader="O" class="letters-loading">O</span>
                          <span data-text-preloader="A" class="letters-loading">A</span>
                          <span data-text-preloader="D" class="letters-loading">D</span>
                          <span data-text-preloader="I" class="letters-loading">I</span>
                          <span data-text-preloader="N" class="letters-loading">N</span>
                          <span data-text-preloader="G" class="letters-loading">G</span>
                        </div>
                      </div>  
                      <div class="loader-section section-left"></div>
                      <div class="loader-section section-right"></div>
                    </div>
                  </div>
      </section>
             
      <script>
        var page = "displayPage";
    </script>
    


      


    <div id="qrc_page_qrcode_popup" class="animate-bottom">
        <button class="btn" id="btn_page_qr_code_close">
            <i class="icon-cross"></i>
        </button>
        <div id="qr_profile_section" style="padding: 40px 0;">
            <div class="qrc_profile_inner_info_popup">
                <div class="qrc_profile_pic_popup" style="background-image: url('1598683042998.jpg');"></div>
                <h2>Utkarsh Suryaman</h2>
                <p>Indian Institute of Technology</p>
                <p class="qrc_profile_company">Student</p>
            </div>
            <div class="qrc_profile_qrcode_popup">
                <img width="200" src="Rickrolling_QR_code.png" class="img-fluid" alt="QR Code" crossorigin="anonymous">
            </div>
        </div>
        <div>
            Add your Digital Business Card to Wallet
        </div>
        <div style="display: flex; justify-content: center; margin: 20px; gap: 8px;">
            <a href="new.html" class="qrc_btn_add_to_google_wallet">
                <img height="42" src="google_wallet.svg" alt="Add to Google Wallet">
            </a>
            <a href="new.html" class="qrc_btn_add_to_apple_wallet">
                <img height="42" src="apple_wallet.svg" alt="Add to Apple Wallet">
            </a>
        </div>








        <div class="qr_popup_button_container">
    <a href="#" class="qrc_addtohomescreen qrc_btn_add_to_home_screen" onclick="showInstallPopup()">
        <div class="qrc_action_button_icon">
            <img src="add_to_homescreen.webp" alt="Add to Home Screen Icon">
        </div>                
        <div class="qrc_addtohomescreen_text">Add to Home Screen</div>
    </a>
    <a href="IMG_1755.jpg" download="IMG_1755.jpg" class="qrc_addtohomescreen qrc_btn_save_t0_gallery">
        <div class="qrc_action_button_icon">
            <img src="photo_gallery.webp" alt="Add to Gallery Icon">
        </div>             
        <div class="qrc_addtohomescreen_text">Add to Gallery</div>   
    </a>
</div>



<script>
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPopup();
    });

    function showInstallPopup() {
        const installPopup = document.getElementById('installPopup');
        installPopup.style.display = 'block';
    }

    function closeInstallPopup() {
        const installPopup = document.getElementById('installPopup');
        installPopup.style.display = 'none';
    }

    function installApp() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the installation');
                } else {
                    console.log('User dismissed the installation');
                }
                deferredPrompt = null;
                closeInstallPopup();
            });
        }
    }
</script>









        <div class="qrc_addtohome_info" style="display:none;">
            <img src="add_to_homescreen_1.png" class="img-fluid" alt="Add to Home Screen Step 1">
            <img src="add_to_homescreen_2.png" class="img-fluid" alt="Add to Home Screen Step 2">
        </div>
    </div>




<div class="qrc_page_wrapper thinScrollBar">
    <div class="pg_background" style="background-image: url('fb_cover.svg');"></div>
    <div class="qrc_page_inner">
        <div class="section qrc_profile_5">
            <div class="qrc_profile_brand_logo">
                <img src="iitrpr_logo.jpg" alt="Brand Logo">
            </div>
            <div class="qrc_profile_inner">
                <div class="qrc_profilepic" style="background-image: url('1598683042998_m.jpg');"></div>
                <div class="qrc_profile_inner_info">
                    <h2>Utkarsh</h2>
                    <p>Indian Institute of Technology</p>
                    <p><strong>MTech-Research Student</strong></p>
                </div>
            </div>
            <div class="qrc_profile_shortcut">
                <ul>
                    <li class="qr_cc_card"><a href="tel:7018753323"><span class="icon-smartphone_1"></span></a></li>
                    <li class="qr_cc_card"><a href="mailto:2022aim1015@iitrpr.ac.in"><span class="icon-email_1"></span></a></li>
                    <li class="qr_cc_card"><a href="https://wa.me/7018753323"><span class="icon-whatsapp_1"></span></a></li>
                    <li class="qr_cc_card"><a href="https://goo.gl/maps/UVg99q5v51rPbMMY7"><span class="icon-pin"></span></a></li>
                </ul>
            </div>
        </div>
        <div class="section qrc_heading_text qr_cc_card">
            <h2>About Me</h2>
            <p>Hi, Utkash side, <br>
                I am computer science engineer post graduate from Indian Institute of Technology, and graguade from Thapar institute of technology.
            </p>
        </div>
        <div class="section qrc_contact qr_cc_card">
            <div class="qrc_contact_header">
                <div class="qrc_contact_hdr_img" style="background-image: url('contactus.png');"></div>
                <div class="qrc_contact_hdr_text">Contact Us</div>
            </div>
            <div class="qrc_contact_info">
                <div class="qrc_contact_info_title">Call Me</div>
                <div class="qrc_contact_number"><a href="tel:+91 7018753323">7018753323</a></div>
            </div>
            <div class="qrc_email_info">
                <div class="qrc_email_info_title">Email</div>
                <div class="qrc_email_id"><a href="mailto:2022aim1015@iitrpr.ac.in">2022aim1015@iitrpr.ac.in</a></div>
            </div>
            <div class="qrc_address_info">
                <div class="qrc_address_info_title">Address</div>
                <div class="qrc_address_text">SE-341 , Satluj Hostel , Indian Institute Of Technology , ropar ,punjab ,140001 <br>India</div>
                <a class="qrc_direction_btn" href=" https://goo.gl/maps/UVg99q5v51rPbMMY7" target="_blank">
                    <span class="icon-direction_1"></span>Direction
                </a>
            </div>
        </div>


       
<div class="section qrc_gallery qr_cc_card">
    <div class="qrc_heading">
        <h2>My Galary</h2>
        <p>See few of my photos enjoying in mountains.</p>
    </div>
    <div class="qrc_gallery_wrapper">
        <ul class="qrc_gallery_grid_1">
            <li>
                <a rel="nofollow noopener noreferrer" href="IMG_1755.jpg" data-lightbox="images-gallery">
                    <img class="img-fluid" src="IMG_1755.jpg" alt="Gallery Image 1">
                </a>
            </li>
            <li>
                <a rel="nofollow noopener noreferrer" href="IMG_1356.jpg" data-lightbox="images-gallery">
                    <img class="img-fluid" src="IMG_1356.jpg" alt="Gallery Image 2">
                </a>
            </li>
            <li>
                <a rel="nofollow noopener noreferrer" href="IMG_0360.jpg" data-lightbox="images-gallery">
                    <img class="img-fluid" src="IMG_0360.jpg" alt="Gallery Image 3">
                </a>
            </li>
            <!-- Add more images as needed -->
        </ul>
    </div>
</div>

<script>
    // Function to handle image viewer with next and previous page buttons
    function handleImageViewer() {
        const lightboxContainer = document.querySelector('.lightboxContainer');
        const images = document.querySelectorAll('[data-lightbox="images-gallery"]');

        // Add event listener to each image
        images.forEach(image => {
            image.addEventListener('click', e => {
                e.preventDefault();
                const index = Array.from(images).indexOf(image);
                openLightbox(index);
            });
        });

        // Open lightbox
        function openLightbox(index) {
            lightboxContainer.innerHTML = `
                <div class="lightbox">
                    <span class="prev" onclick="prevImage(${index})">&#10094;</span>
                    <span class="next" onclick="nextImage(${index})">&#10095;</span>
                    <img src="${images[index].getAttribute('href')}" alt="Gallery Image">
                </div>
            `;
        }

        // Navigate to previous image
        window.prevImage = function(index) {
            index = (index - 1 + images.length) % images.length;
            openLightbox(index);
        };

        // Navigate to next image
        window.nextImage = function(index) {
            index = (index + 1) % images.length;
            openLightbox(index);
        };
    }

    document.addEventListener('DOMContentLoaded', handleImageViewer);
</script>







        <div class="section qrc_social_links">
            <ul class="qrc_social_links_list">
                <li class="qr_cc_card">
                    <div class="qrc_heading">
                        <h2>Find me Here</h2>
                    </div>
                    <a rel="nofollow noopener noreferrer social_link_a" onclick="if(typeof triggerSocialUrlClicked == 'function') return triggerSocialUrlClicked(this);" href="https://www.linkedin.com/in/utk-arsh-798b15259/" target="_blank">
                        <div class="qrc_social_icon" style="background-image:url('https://www.qrcodechimp.com/images/digitalCard/linkedin_icon@72x.png');"></div>
                        <div class="qrc_social_text">
                            <div class="qrc_social_text_heading">LinkedIn</div>
                        </div>
                        <div class="qrc_social_action">
                            <span class="icon-right_arrow"></span>
                        </div>
                    </a>
                </li>
                <li class="qr_cc_card">
                    <a rel="nofollow noopener noreferrer social_link_a" onclick="if(typeof triggerSocialUrlClicked == 'function') return triggerSocialUrlClicked(this);" href="https://www.instagram.com/webbed_dev/" target="_blank">
                        <div class="qrc_social_icon" style="background-image:url('https://www.qrcodechimp.com/images/digitalCard/insta_icon@72x.png');"></div>
                        <div class="qrc_social_text">
                            <div class="qrc_social_text_heading">Instagram</div>
                        </div>
                        <div class="qrc_social_action">
                            <span class="icon-right_arrow"></span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <div class="section qrc_social_links">
            <ul class="qrc_social_links_list">
                <li class="qr_cc_card">
                    <div class="qrc_heading">
                        <h2>Links</h2>
                        <p>Find Us Here</p>
                    </div>
                    <a rel="nofollow noopener noreferrer" href="https://cse.iitrpr.ac.in/" target="_blank">
                        <div class="qrc_social_icon" style="background-image:url('https://www.qrcodechimp.com/images/digitalCard/weblink.png');"></div>
                        <div class="qrc_social_text">
                            <div class="qrc_social_text_heading">Company Website</div>
                        </div>
                        <div class="qrc_social_action">
                            <span class="icon-right_arrow"></span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div class="extra_button_wrapper">
        <div style="display:flex">
            <button class="btn" id="btn_page_qr_code"><i class="icon-qrcode"></i></button>
            <button class="btn" id="btn_share_page"><i class="icon-file_upload_1"></i></button>
        </div>
        <a rel="nofollow noopener noreferrer" href="javascript:void(0);" class="qrc_addtocontact">
            <div class="qrc_addtocontact_text">Add to Contact</div>
            <div class="qrc_addtocontact_circle">
                <span class="icon-add_1"></span>
            </div>
        </a>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const shareButton = document.getElementById('btn_share_page');

            if (navigator.share) {
                shareButton.addEventListener('click', function() {
                    navigator.share({
                        title: 'Utkarsh Suryaman',
                        text: 'Hi , I am Utkarsh',
                        url: 'http://localhost/fetchdata/'
                    })
                    .then(() => console.log('Shared successfully'))
                    .catch((error) => console.error('Error sharing:', error));
                });
            } else {
                // Fallback for browsers that do not support the Web Share API
                shareButton.addEventListener('click', function() {
                    alert('Sharing is not supported on this browser.');
                });
            }
        });
    </script>

    <script>
        $(".qrc_addtocontact").on("click", function(e){
            e.preventDefault();
            if(window.self !== window.top) {
                return;
            }

            // Define the URL of the file to be downloaded
            let fileUrl = 'UtkarshSuryaman.vcf'; // Replace with your .vcf file URL
            let fileName = 'UtkarshSuryaman.vcf'; // Replace with your desired file name

            // Create a temporary anchor element
            let a = document.createElement('a');
            a.href = fileUrl;
            a.download = fileName;

            // Append the anchor to the body
            document.body.appendChild(a);

            // Trigger the download by simulating a click
            a.click();

            // Remove the anchor from the document
            document.body.removeChild(a);
        });
    </script>

<div id="lightboxOverlay" tabindex="-1" class="lightboxOverlay" style="display: none;"></div>
<div id="lightbox" tabindex="-1" class="lightbox" style="display: none;">
    <div class="lb-outerContainer">
        <div class="lb-container">
            <img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="">
            <div class="lb-nav">
                <a class="lb-prev" aria-label="Previous image" href="new"></a>
                <a class="lb-next" aria-label="Next image" href="new"></a>
            </div>
            <div class="lb-loader"><a class="lb-cancel"></a></div>
        </div>
    </div>
    <div class="lb-dataContainer">
        <div class="lb-data">
            <div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div>
            <div class="lb-closeContainer"><a class="lb-close"></a></div>
        </div>
    </div>
</div>


<script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
          .then(registration => {
            console.log('Service Worker registered:', registration);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  </script>




    <div class="container my-4" >
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                </tr>
            </thead>
            <tbody>
                <?php
                // Check if there are results and output data in each row
                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        $id = $row["Name"];
                        $firstname = $row["address"];
                        $lastname = $row["mail"];
                        $email = $row["telephone"];
                        
                        echo "<tr>
                                <th scope='row'>$id</th>
                                <td>$firstname</td>
                                <td>$lastname</td>
                                <td>$email</td>
                              </tr>";
                    }
                } else {
                    echo "<tr><td colspan='4'>No results found</td></tr>";
                }
                
                // Close connection
                mysqli_close($conn);
                ?>
            </tbody>
        </table>
    </div>
    





    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>



    <script>
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    $(document).ready(function() {
        // Initialize Lightbox Plus
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
        });
    });
</script>

<script>
$(document).ready(function() {
  setTimeout(function() {
    $('#ctn-preloader').addClass('loaded');
    // Una vez haya terminado el preloader aparezca el scroll
    $('body').removeClass('no-scroll-y');

    if ($('#ctn-preloader').hasClass('loaded')) {
      // Es para que una vez que se haya ido el preloader se elimine toda la seccion preloader
      $('#preloader').delay(1000).queue(function() {
        $(this).remove();
      });
    }
  }, 3000);
});
</script>









  </body>





</html>
