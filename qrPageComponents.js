var _timeoutId = null;
const QRPageComponents = {
    _save_callback: null,
    components: [],
    selected_template: 0,
    open_index: 0,
    page_setting: {},
    pr_64: "",
    _set_image: 0,
    cards_open: [1],
    _contact_button_html: "",
    _qr_from_bulk: false,
    _privacyConfirmed: false,
    _touched: false,
    setPageCookie: function() {
        createCookie("p_i", readCookie("qB") + "_" + random_str(10), 1);
    },
    init: function() {
        this.setPageCookie();
        // if (getUrlParameterByName("basic") && isMobile.any()) {
        if ($("#simple_form").length) {
            QRPageComponents.listeners();
            return;
        }
        if (typeof __savedQrCodeParams == "undefined") {
            __savedQrCodeParams = {};
        }
        if (
            typeof __savedQrCodeParams != "undefined" &&
            !empty(__savedQrCodeParams)
        ) {
            QRPageComponents.components = __savedQrCodeParams["content"];
            QRPageComponents.page_setting = extractDataFromArray(
                __savedQrCodeParams, ["page_setting"], {}
            );
        }

        QRPageComponents._qr_from_bulk =
            $("input[name=id]").val() == "new" ?
            false :
            extractDataFromArray(__savedQrCodeParams, ["bulk"], false);
        if (QRPageComponents.isBulkUploadQRCode()) {
            $("#page-tab-style-design").remove();
            $("#page-tab-qr-design").remove();
            $("#page-tab-input").html("Edit Content Mode");
            $(document).on("click", "#page-tab-input", function(e) {
                $("#btn_next_components_tab").html("Save");
                $("#btn_back_components_tab").addClass("hide");
            });
            $("#btn_next_components_tab").html("Save");
            $($(".design_nav .nav-item")[1]).remove();
            $($(".design_nav .nav-item")[1]).remove();
            $($(".design_nav .nav-item")[1]).remove();
            $("#template_select_helper").html(
                "You cannot change the page template in Edit Content Mode"
            );
            $("#btn_add_qr_component").remove();
        }

        QRPageComponents.selected_template = $(".page_template_card.active").data(
            "index"
        );
        if (
            typeof QRPageComponents.selected_template == "undefined" ||
            QRPageComponents.selected_template == NaN ||
            QRPageComponents.selected_template == ""
        ) {
            QRPageComponents.selected_template = 0;
        }

        if (empty(QRPageComponents.components)) {
            QRPageComponents.components = getComponentContentFromTemplate(
                QRPageComponents.selected_template
            );
        }
        if (empty(QRPageComponents.components)) {
            QRPageComponents.components = defaultContentArray.content;
        }

        QRPageComponents.selected_template = parseInt(
            extractDataFromArray(
                __savedQrCodeParams, ["selected_template"],
                QRPageComponents.selected_template
            )
        );
        if (
            typeof QRPageComponents.selected_template == "undefined" ||
            QRPageComponents.selected_template == NaN ||
            QRPageComponents.selected_template == ""
        ) {
            QRPageComponents.selected_template = 0;
        }

        QRPageStyleComponents.style = extractDataFromArray(
            __savedQrCodeParams, ["style"], {}
        );

        if (page == "displayPage") {
            if (empty(QRPageStyleComponents.style)) {
                QRPageStyleComponents.style = getComponentStyleFromTemplate(
                    QRPageComponents.selected_template
                );
            }
            if (
                typeof __savedQrCodeParams != "undefined" &&
                !empty(extractDataFromArray(__savedQrCodeParams, ["ld_url"], ""))
            ) {
                QRPageStyleComponents.style.ld_img = extractDataFromArray(
                    __savedQrCodeParams, ["ld_url"],
                    ""
                );
            }
            if (
                typeof __savedQrCodeParams != "undefined" &&
                !empty(
                    extractDataFromArray(__savedQrCodeParams, ["style_selected"], "")
                )
            ) {
                QRPageStyleComponents.style_selected = extractDataFromArray(
                    __savedQrCodeParams, ["style_selected"], -1
                );
            }

            QRPageComponents.generateQRImage();
            exponentialBackoff(
                () => {
                    let pass = true;
                    if (__page_type == "digital-business-card") {
                        if (DigitalBusinessPageTemplates.length == 6) {
                            pass = false;
                        }
                    } else if (__page_type == "digital-business-cards") {
                        if (DigitalBusinessPageTemplates.length == 6) {
                            pass = false;
                        }
                    }
                    return pass;
                },
                30,
                1000,
                () => {
                    QRPageComponents.prepareHtml(1);
                }
            );
            return;
        }
        QRPageComponents.listeners();

        exponentialBackoff(
            () => {
                let pass = true;
                if (page == "digital-business-card") {
                    if (DigitalBusinessPageTemplates.length == 6) {
                        pass = false;
                    }
                } else if (__page_type == "digital-business-cards") {
                    if (DigitalBusinessPageTemplates.length == 6) {
                        pass = false;
                    }
                }
                return typeof _qrOptions != "undefined" && pass;
            },
            30,
            1000,
            () => {
                if (
                    extractDataFromArray(__savedQrCodeParams, ["id"], "new") == "new" &&
                    page == "digital-business-cards"
                ) {
                    QRPageComponents.components = getComponentContentFromTemplate(
                        QRPageComponents.selected_template
                    );
                }
                if (empty(QRPageStyleComponents.style)) {
                    QRPageStyleComponents.style = getComponentStyleFromTemplate(
                        QRPageComponents.selected_template
                    );
                }
                if (
                    typeof __savedQrCodeParams != "undefined" &&
                    !empty(extractDataFromArray(__savedQrCodeParams, ["ld_url"], ""))
                ) {
                    QRPageStyleComponents.style.ld_img = extractDataFromArray(
                        __savedQrCodeParams, ["ld_url"],
                        ""
                    );
                }
                if (
                    typeof __savedQrCodeParams != "undefined" &&
                    !empty(
                        extractDataFromArray(__savedQrCodeParams, ["style_selected"], "")
                    )
                ) {
                    QRPageStyleComponents.style_selected = extractDataFromArray(
                        __savedQrCodeParams, ["style_selected"], -1
                    );
                }
                QRPageComponents.preparePageInputSections();
                QRPageStyleComponents.getStyleContainerComponents();
                QRDesignComponents.getWrapperHtml();
                QRPageComponents.syncShortUrl($(".short_url_data").text());
                QRPageStyleComponents.handleStyleInputChange();
                QRPageComponents.prepareHtml();
            }
        );
    },
    syncShortUrl: function(short_url) {
        short_url = short_url.toLowerCase();
        if (!short_url.startsWith("https://")) {
            short_url = "https://" + short_url;
        }
        let short_url_code = "";
        if (short_url.includes("/r/")) {
            short_url_code = short_url.split("//")[1].split("/r/")[1];
        } else {
            short_url_code = short_url.split("//")[1].split("/")[1];
        }
        $(".short_url_data").text(short_url);
        $("#short_url_input").val(short_url_code);
        $(".short_url_data_tab").attr("href", short_url);
        $(".short_url_data_copy").attr(
            "onclick",
            "copyTextToClipboard('" + short_url + "'); return false;"
        );
    },
    getPageName: function() {
        let page_type = page;
        if (page == "displayPage" && typeof __page_type != undefined) {
            page_type = __page_type;
        }
        return page_type;
    },
    syncAllCardDisplayStates: function() {
        QRPageComponents.cards_open = [];
        Array.from(
            $("#qr_page_component_container .qr_page_component_card")
        ).forEach((ele, index) => {
            QRPageComponents.cards_open.push(
                $(ele).find(".qr_page_component_card_body").hasClass("show") ? 1 : 0
            );
        });
    },
    isBulkUploadQRCode: function() {
        return QRPageComponents._qr_from_bulk;
        return false;
    },
    listeners: function() {
        function checkitem() {
            // check function
            var $this = $("#qrc_template_slider");
            if ($(".carousel-inner .carousel-item:first").hasClass("active")) {
                // Hide left arrow
                $this.children(".carousel-control-prev").hide();
                // But show right arrow
                $this.children(".carousel-control-next").show();
            } else if ($(".carousel-inner .carousel-item:last").hasClass("active")) {
                // Hide right arrow
                $this.children(".carousel-control-next").hide();
                // But show left arrow
                $this.children(".carousel-control-prev").show();
            } else {
                $this.children(".carousel-control-prev").show();
                $this.children(".carousel-control-next").show();
            }
        }

        checkitem();
        $("#qrc_template_slider").on("slid.bs.carousel", checkitem);

        $(".design_nav .nav .nav-item").on("click", function(e) {
            document.body.scrollTop = document.documentElement.scrollTop = 320;

            $("#btn_back_components_tab").removeClass("hide");
            $("#btn_next_components_tab").show();
            $("#btn_next_components_tab").html(
                `Next<i class="icon-arrow-right2 font-16 easin ml-2"></i>`
            );

            if ($(this).find("a").text() == "4Bulk Upload") {
                // $("#btn_next_components_tab").html(`Save`)
                if (QRPageComponents._touched && $("input[name=id]").val() == "new") {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    let already_saved = !empty(BulkUploadHandler.bulk_upload_rec_id);
                    let ele = this;
                    Swal.fire({
                        title: already_saved ?
                            "Save Changes" :
                            "Save Work for Sample File Generation",
                        text: already_saved ?
                            "Do you want to save changes to the template?" :
                            "Let's save your current work now so that we can generate sample file for you.",
                        confirmButtonText: already_saved ? "Save" : "Continue",
                        showCancelButton: true,
                        reverseButtons: true,
                    }).then((result) => {
                        $("#btn_next_components_tab").show();
                        if (result.isConfirmed) {
                            if (already_saved) {
                                QRPageComponents._touched = false;
                                BulkUploadHandler.saveBulkUploadAPI(() => {
                                    $(".design_nav li a").removeClass("active");
                                    $(ele).find("a").addClass("active");
                                    let bulk_content_tab = $(ele).find("a").attr("href");
                                    $("#page-content .tab-pane")
                                        .removeClass("active")
                                        .removeClass("show");
                                    $(bulk_content_tab).addClass("active show");
                                    $("#btn_next_components_tab").hide();
                                });
                            } else {
                                BulkUploadHandler.createBulkUpload(page, true, () => {
                                    $(".design_nav li a").removeClass("active");
                                    $(ele).find("a").addClass("active");
                                    let bulk_content_tab = $(ele).find("a").attr("href");
                                    $("#page-content .tab-pane")
                                        .removeClass("active")
                                        .removeClass("show");
                                    $(bulk_content_tab).addClass("active show");
                                    $("#btn_next_components_tab").hide();
                                });
                            }
                        }
                    });
                } else {
                    if (
                        $("input[name=id]").val() == "new" &&
                        !getUrlParameterByName("bulk")
                    ) {
                        $("#btn_next_components_tab").hide();
                    } else {
                        $("#btn_next_components_tab").html(`Save`);
                    }
                    $(".preview_nav button[data-view=page]").click();
                }
            } else if ($(this).find("a").text() == "3QR Code") {
                if (!(
                        $("#bulk_upload_switch").prop("checked") ||
                        getUrlParameterByName("bulk")
                    )) {
                    $("#btn_next_components_tab").html(`Save`);
                }

                $(".preview_nav button[data-view=qr]").click();
            } else if ($(this).find("a").text() == "1Content") {
                $("#btn_back_components_tab").addClass("hide");
            } else {
                $(".preview_nav button[data-view=page]").click();
            }
        });

        $(document).on("click", "#btn_next_components_tab", function(e) {
            e.preventDefault();
            const tab_index = $(".design_nav .nav-link.active").parents("li").index();

            if ($("#btn_next_components_tab").html() == `Save`) {
                QRPageComponents.saveQRCode();
            } else {
                $($(".design_nav .nav-link")[tab_index + 1]).click();
            }
        });
        $(document).on("click", "#btn_back_components_tab", function(e) {
            e.preventDefault();
            const tab_index = $(".design_nav .nav-link.active").parents("li").index();
            $($(".design_nav .nav-link")[tab_index - 1]).click();
        });

        $("#short_url_input").on("input", function(e) {
            let short_domain = $(".short_url_slug_prepend")[0].innerText;
            let short_url =
                (short_domain.startsWith("https:") ?
                    short_domain :
                    "https://" + short_domain) +
                e.target.value.cleanReplace(/[^a-z0-9\-]/gi, "");
            QRPageComponents.syncShortUrl(short_url);
        });

        $(document).on("click", ".page_template_card", function(e) {
            if (QRPageComponents.isBulkUploadQRCode()) {
                return;
            }
            if ($(this).data("index") == undefined) {
                return;
            }
            let pr_img = $(
                '.qr_page_component_card[data-type="profile"] .img_uploaded_card.selected_img'
            ).css("background-image");
            if (!empty(pr_img)) {
                pr_img = pr_img.split('"')[1];
            } else {
                pr_img = "";
            }
            if (
                pr_img.includes("/images/digitalCard/") ||
                pr_img.includes("/images/defaultImages/")
            ) {
                let content = getComponentContentFromTemplate($(this).data("index"));
                content.forEach((component) => {
                    if (component.component == "profile") {
                        let c_pr_img = extractDataFromArray(component, ["pr_img"], "");
                        if (c_pr_img != "") {
                            $(
                                '.qr_page_component_card[data-type="profile"] .img_uploaded_card.selected_img'
                            ).css("background-image", "url('" + c_pr_img + "')");

                            QRPageComponents.components.forEach((c) => {
                                if (c.component == "profile") {
                                    c.pr_img = c_pr_img;
                                }
                            });
                        }
                    }
                });
            }

            $(".page_template_card").removeClass("active");
            $(this).addClass("active");

            QRPageComponents.selected_template = $(this).data("index");
            const ld_img = QRPageStyleComponents.style.ld_img;
            QRPageStyleComponents.style = getComponentStyleFromTemplate(
                $(this).data("index")
            );
            QRPageStyleComponents.style.ld_img = ld_img;

            let template_content = getComponentContentFromTemplate(
                $(this).data("index")
            );
            let profile = {};

            QRPageComponents.components.forEach((component, index) => {
                if (component.component == "profile") {
                    profile = component;
                }
            });

            if (!empty(profile)) {
                template_content.forEach((component) => {
                    if (component.component == "profile") {
                        profile.show_brand_img = 0;
                        profile.show_pr_bg_img = 0;
                        profile.pr_img_label = extractDataFromArray(
                            component, ["pr_img_label"],
                            "(200x200px, 1:1 Ratio)"
                        );
                        if (typeof component["show_brand_img"] != "undefined") {
                            profile.show_brand_img = component["show_brand_img"];
                            profile.enable_br = 1;
                            profile.br_img_label = extractDataFromArray(
                                component, ["br_img_label"],
                                ""
                            );
                            let br_img = extractDataFromArray(profile, ["br_img"], "");
                            profile.br_img = component["br_img"];
                            if (!empty(br_img)) {
                                if (!br_img.includes("/images/digitalCard/")) {
                                    profile.br_img = br_img;
                                }
                            }
                        }
                        if (typeof component["show_pr_bg_img"] != "undefined") {
                            profile.show_pr_bg_img = component["show_pr_bg_img"];
                            profile.enable_pr_bg = 1;
                            profile.pr_bg_img_label = extractDataFromArray(
                                component, ["pr_bg_img_label"],
                                ""
                            );
                            let pr_bg_img = extractDataFromArray(profile, ["pr_bg_img"], "");
                            profile.pr_bg_img = component["pr_bg_img"];
                            if (!empty(pr_bg_img)) {
                                if (!pr_bg_img.includes("/images/digitalCard/")) {
                                    profile.pr_bg_img = pr_bg_img;
                                }
                            }
                        }
                    }
                });
            }

            QRPageComponents.preparePageInputSections();
            QRPageStyleComponents.getStyleContainerComponents(false);
        });

        $(document).on("click", ".add_profile_component a", function(e) {
            e.preventDefault();
            let type = $(this).data("type");
            $(this)
                .parents(".qr_page_component_card_body")
                .find(".list-group")
                .append(ComponentLists.profile.getContactShortcutItem(type, ""));
            QRPageComponents.handleInputChange(e);
        });
        $(document).on("click", ".add_contact_component a", function(e) {
            e.preventDefault();
            let type = $(this).data("type");
            $(this)
                .parents(".qr_page_component_card_body")
                .find(".list-group")
                .append(ComponentLists.contact.getContactInfoItem({
                    type
                }));
            QRPageComponents.handleInputChange(e);
        });

        $(document).on("click", ".add_qr_component a", function(e) {
            e.preventDefault();
            let component = $(this).data("type");
            QRPageComponents.components.push(ComponentLists[component].default);
            QRPageComponents.open_index = QRPageComponents.components.length - 1;
            QRPageComponents.prepareHtml();
            QRPageComponents.syncAllCardDisplayStates();
            QRPageComponents.cards_open[QRPageComponents.components.length - 1] = 1;
            QRPageComponents.preparePageInputSections();
        });
        $(document).on("click", ".video_type_btn", function(e) {
            if (QRPageComponents.isBulkUploadQRCode()) {
                return;
            }
            e.preventDefault();
            $(this).parents(".btn-group").find("button").removeClass("active");
            $(this).addClass("active");
            QRPageComponents.handleInputChange(e);
        });

        $(document).on("click", ".btn_add_web_link", function(e) {
            e.preventDefault();
            $(this)
                .parents(".qr_page_component_card_body")
                .find(".list-group")
                .append(
                    ComponentLists.web_links.getLinkItem(
                        ComponentLists.web_links.default.links[0]
                    )
                );
            QRPageComponents.handleInputChange(e);
        });
        $(document).on("click", ".btn_add_custom_field", function(e) {
            e.preventDefault();
            $(this)
                .parents(".qr_page_component_card_body")
                .find(".list-group")
                .append(
                    ComponentLists.custom_fields.getCustomFieldHtml({
                        key: "",
                        val: ""
                    })
                );
            QRPageComponents.handleInputChange(e);
        });
        $(document).on("click", ".btn_add_team", function(e) {
            e.preventDefault();
            $(this)
                .parents(".qr_page_component_card_body")
                .find(".list-group")
                .append(
                    ComponentLists.team.getTeamFieldHtml({
                        name: "",
                        designation: "",
                        description: "",
                        pr_img: "/images/defaultImages/businesspage/team_thumb_2.png",
                        enable_pr: 1
                    })
                );
            QRPageComponents.handleInputChange(e);
        });
        $(document).on("click", ".btn_add_testimonial", function(e) {
            e.preventDefault();
            $(this)
                .parents(".qr_page_component_card_body")
                .find(".list-group")
                .append(
                    ComponentLists.testimonial.getTestimonialFieldHtml({
                        name: "",
                        designation: "",
                        description: "",
                        pr_img: "/images/defaultImages/businesspage/testimonial_thumb.png",
                        enable_pr: 1
                    })
                );
            QRPageComponents.handleInputChange(e);
        });
        $(document).on("click", ".btn_add_social_link button", function(e) {
            e.preventDefault();
            $(this)
                .parents(".qr_page_component_card_body")
                .find(".list-group")
                .append(
                    ComponentLists.social_link.getSocialLinkItem(
                        ComponentLists.social_link.default.links[0]
                    )
                );
            QRPageComponents.handleInputChange(e);
        });

        $(document).on("click", ".btn_add_pdf_gallery button", function(e) {
            e.preventDefault();
            $(this)
                .parents(".qr_page_component_card_body")
                .find(".list-group")
                .append(
                    ComponentLists.pdf_gallery.getPDFItem(
                        ComponentLists.pdf_gallery.default.pdfs[0]
                    )
                );
            QRPageComponents.handleInputChange(e);
        });

        $(document).on(
            "click",
            ".qr_page_component_card_title, .toggle_card_visiblitiy",
            function(e) {
                let parent = $(this).parents(".qr_page_component_card");
                let action = parent
                    .find(".toggle_card_visiblitiy i")
                    .hasClass("icon-add_1") ?
                    "expand" :
                    "hide";

                // let parentTab = $(this).parents(".tab-pane")
                // parentTab.find('.toggle_card_visiblitiy i').removeClass('icon-remove_1')
                // parentTab.find('.toggle_card_visiblitiy i').addClass('icon-add_1')
                // parentTab.find('.qr_page_component_card_body').removeClass("show")
                // parentTab.find('.card-header').attr("aria-expanded", 'false')

                if (action == "expand") {
                    parent.find(".toggle_card_visiblitiy i").removeClass("icon-add_1");
                    parent.find(".toggle_card_visiblitiy i").addClass("icon-remove_1");
                    parent.find(".qr_page_component_card_body").addClass("show");
                    parent.find(".card-header").attr("aria-expanded", "true");
                } else {
                    parent.find(".toggle_card_visiblitiy i").removeClass("icon-remove_1");
                    parent.find(".toggle_card_visiblitiy i").addClass("icon-add_1");
                    parent.find(".qr_page_component_card_body").removeClass("show");
                    parent.find(".card-header").attr("aria-expanded", "false");
                }
            }
        );

        $(document).on(
            "change",
            ".title_desc_wrapper input[name=header_enable]",
            function(e) {
                if (e.target.checked) {
                    $(this)
                        .parents(".title_desc_wrapper")
                        .find(".title_desc_wrapper_input")
                        .show();
                } else {
                    $(this)
                        .parents(".title_desc_wrapper")
                        .find(".title_desc_wrapper_input")
                        .hide();
                }
            }
        );

        $(document).on("click", ".image_view_type_card", function(e) {
            $(this)
                .parents(".image_view_type_wrapper")
                .find(".image_view_type_card")
                .removeClass("selected");
            $(this).addClass("selected");

            QRPageComponents.handleInputChange(e);
        });

        $(document).on("click", ".image_gallery_view_type_card", function(e) {
            console.log("enrter")
            $(this)
                .parents(".image_view_type_wrapper")
                .find(".image_gallery_view_type_card")
                .removeClass("selected");
            $(this).addClass("selected");

            if ($(this).data("type") == 'slider') {
                $(".img_title_link input[name='title']").prop('disabled', true);
            } else {
                $(".img_title_link input[name='title']").prop('disabled', false);
            }

            QRPageComponents.handleInputChange(e);
        });

        $(document).on("click", ".img_uploaded_card.upload_img", function(e) {
            if (!isUserLoggedIn()) {
                e.stopPropagation();
                $("#signup-free").modal("show");
                __signup_callback = false;
                return;
            }

            let parent = $(this).parents(".img_upload_card_wrapper");
            FileManager.showFileManager("IMAGE", 1, (file) => {
                let url = extractDataFromArray(file, [0, "asset_url"], "");
                parent.find(".selected_img").css("background-image", "");
                parent
                    .find(".selected_img")
                    .css("background-image", "url(" + url + ")");
                if (getUrlParameterByName("basic")) {
                    return;
                }
                if (parent.parents(".pg_loader_wrp").length > 0) {
                    QRPageStyleComponents.style.ld_img = url;
                    QRPageStyleComponents.handleStyleInputChange();
                } else {
                    QRPageComponents.handleInputChange(e);
                }
            });
        });

        $(document).on("click", ".upload_pdfs", function(e) {
            if (!isUserLoggedIn()) {
                e.stopPropagation();
                $("#signup-free").modal("show");
                __signup_callback = false;
                return;
            }

            let parent = $(this).parents(".pdf_gallery_input_wrapper");
            FileManager.showFileManager("PDF", 1, (file) => {
                let url = checkAndWhiteLabelCdnS3Url("https:" + extractDataFromArray(file, [0, "asset_url"], ""));
                parent.find("input[name=url]").val(url);
                if (getUrlParameterByName("basic")) {
                    return;
                }
                QRPageComponents.handleInputChange(e);
            });
        });
        $(document).on("click", ".img_uploaded_card.upload_imgs", function(e) {
            if (!isUserLoggedIn()) {
                e.stopPropagation();
                $("#signup-free").modal("show");
                __signup_callback = false;
                return;
            }

            let parent = $(this).parents(".img_upload_card_wrapper");
            FileManager.showFileManager("IMAGE", 16, (file) => {
                let url = extractDataFromArray(file, [0, "asset_url"], "");
                file.forEach((image) => {
                    parent.find(".images_grid_wrapper").append(
                        `<div class="img_uploaded_card multiple_img mr-3 handle-img mb-2" style="background-image:url('` +
                        image.asset_url +
                        `')">
                                <div class="img_action image_css">
                                    <a href="#" class="btn text-white"><i class="icon-delete_1 font-14"></i></a>
                                </div>
                            </div>`
                    );
                });
                QRPageComponents.handleInputChange(e);
            });
        });

        $(document).on("click", ".img_uploaded_card.upload_imgs_2", function(e) {
            if (!isUserLoggedIn()) {
                e.stopPropagation();
                $("#signup-free").modal("show");
                __signup_callback = false;
                return;
            }

            let parent = $(this).parents(".img_upload_card_wrapper");
            FileManager.showFileManager("IMAGE", 16, (file) => {
                let isDisabled = '';
                if ($('.image_gallery_view_type_card.selected').data("type") == 'slider') {
                    isDisabled = 'disabled';
                }

                let url = extractDataFromArray(file, [0, "asset_url"], "");
                file.forEach((image) => {
                    parent.find(".images_grid_wrapper_2").append(
                        `<div class="img_data_div">
                        <div class="action_img_buttons">
                            <div class="img_action">
                                <a href="#" class="btn"><i class="icon-delete_1"></i></a>
                            </div>
                            <div class="img_action_2 handle-img">
                                <a href="#" class="btn"><i class="icon-drag_1"></i></a>
                            </div>
                        </div>
                        <div class="img_data_div_1">
                            <div class="img_uploaded_card multiple_img img_container_div" style="background-image:url('` +
                        image.asset_url +
                        `')">
                            </div>
                            <div class="img_title_link">
                                <div class="d-flex">
                                    <input class="form-control" autocomplete="off" name="title"  value="" type="text" placeholder="Title" ` + isDisabled + `>
                                </div>
                                <div></div>
                                <div class="d-flex">
                                    <input class="form-control" autocomplete="off" name="link"  value="" type="text" placeholder="Link">
                                </div>
                            </div>
                        </div>
                    </div>`
                    );
                });
                QRPageComponents.handleInputChange(e);
            });
        });

        $(document).on("click", ".images_grid_wrapper .img_action a", function(e) {
            let card = $(this).parents(".img_uploaded_card");
            let index = $(this).parents(".qr_page_component_card").index();
            showDeleteConfirmation(
                "Delete Image",
                "Are you sure to delete this image?",
                "Delete",
                () => {
                    card.remove();
                    QRPageComponents.handleInputChange(null, index);
                }
            );
        });

        $(document).on("click", ".images_grid_wrapper_2 .img_action a", function(e) {
            let card = $(this).parents(".img_data_div");
            let index = $(this).parents(".qr_page_component_card").index();
            showDeleteConfirmation(
                "Delete Image",
                "Are you sure to delete this image?",
                "Delete",
                () => {
                    card.remove();
                    QRPageComponents.handleInputChange(null, index);
                }
            );
        });

        $(document).on("click", ".btn_delete_pro_card", function(e) {
            let ele = e;
            let index = $(this).parents(".qr_page_component_card").index();
            let card = $(this).parents(".subcomponent_sortable_wrapper");
            showDeleteConfirmation(
                "Delete Sub-Component",
                "Are you sure to delete this sub-component?",
                "Delete",
                () => {
                    card.remove();
                    QRPageComponents.handleInputChange(null, index);
                }
            );
        });

        $(document).on("click", ".btn_delete_component_card", function(e) {
            let index = $(this).parents(".qr_page_component_card").index();
            let card = $(this).parents(".qr_page_component_card");
            showDeleteConfirmation(
                "Delete Component",
                "Are you sure to delete this component?",
                "Delete",
                () => {
                    card.remove();
                    QRPageComponents.components.splice(index, 1);
                    QRPageComponents.prepareHtml();
                }
            );
        });

        $(document).on(
            "input",
            "#page-tab-input-content input, #page-tab-input-content textarea",
            function(e) {
                QRPageComponents.handleInputChange(e);
                if (e.target.name == "contact_shortcut_enable") {
                    if (e.target.checked) {
                        $(".contact_shortcut_container").show();
                    } else {
                        $(".contact_shortcut_container").hide();
                    }
                }
            }
        );
        $(document).on("change", "#page-tab-input-content select", function(e) {
            QRPageComponents.handleInputChange(e);
        });

        $(document).on("change", ".profile_contact_info", function(e) {
            let parent = $(this).parents(".input-group");
            parent
                .find("input")
                .attr(
                    "placeholder",
                    QRPageComponentWrapper.contactOptions[e.target.value].placeholder
                );
        });
        $(document).on(
            "change",
            "#page-tab-style-design-content select",
            function(e) {
                QRPageStyleComponents.handleStyleInputChange(e);
            }
        );
        $(document).on(
            "input",
            "#page-tab-style-design-content input",
            function(e) {
                QRPageStyleComponents.handleStyleInputChange(e);
            }
        );

        $(document).on(
            "change",
            "input[name=page_protection_enable], input[name=contact_protection_enable]",
            function(e) {
                if (
                    e.target.name == "contact_protection_enable" &&
                    $("input[name=page_protection_enable]").prop("checked")
                ) {
                    $("input[name=page_protection_enable]").prop("checked", false);
                } else if (
                    e.target.name == "page_protection_enable" &&
                    $("input[name=contact_protection_enable]").prop("checked")
                ) {
                    $("input[name=contact_protection_enable]").prop("checked", false);
                }
            }
        );

        $(document).on("change", "#btn_dowload_bulk_sample1", function(e) {
            e.preventDefault();
            QRPageComponents.downloadBulkSampleFile();
        });
        $(document).on("change", ".social_media_select", function(e) {
            e.preventDefault();
            let parent = $(this).parents(".social_link_input_wrapper");
            parent
                .find(".img_uploaded_card.selected_img")
                .css("background-image", "");
            parent
                .find(".img_uploaded_card.selected_img")
                .css(
                    "background-image",
                    "url('" +
                    extractDataFromArray(
                        ComponentLists.social_link.socialLinks, [e.target.value, "icon"],
                        ""
                    ) +
                    "')"
                );
        });

        $(document).on(
            "change",
            "input[name=open_24_enable]",
            function(e) {
                e.preventDefault();
                let parent = $(this).parents("#business_hours_wrapper");
                QRPageComponents.handleInputChange(e);
                if (e.target.checked) {
                    parent.find("#business_hours_container_2").hide();
                    parent.find("#business_hours_container_1").show();
                } else {
                    parent.find("#business_hours_container_1").hide();
                    parent.find("#business_hours_container_2").show();
                }
            }
        );

        $("#short_url_input_popup").on("input", function(e) {
            e.stopImmediatePropagation();
            let short_url_code = e.target.value.trim();
            short_url_code = short_url_code.toLowerCase();
            $(this).val(short_url_code.replace(/[^a-zA-Z0-9-]/g, ""));
        });
        FileManager.init("popup");
    },
    preparePageInputSections: function() {
        $("#qr_page_component_container").html("");
        QRPageComponents.components.forEach((component, index) => {
            // if (QRPageComponents.isBulkUploadQRCode() && empty(extractDataFromArray(component, ['card_enable'], 0))) {
            //     return;
            // }
            $("#qr_page_component_container").append(
                QRPageComponentWrapper.getWrapperHtml(
                    index,
                    component, !extractDataFromArray(QRPageComponents, ["cards_open", index], 0)
                )
            );
            QRPageComponentWrapper.emitListeners(index, component);
        });
        new Sortable(document.getElementById("qr_page_component_container"), {
            handle: ".handle", // handle class
            animation: 150,
            ghostClass: "blue-background-class",
            onEnd: function(evt) {
                let comp = QRPageComponents.components.splice(evt.oldIndex, 1)[0];
                QRPageComponents.components.splice(evt.newIndex, 0, comp);
                QRPageComponents.prepareHtml();
            },
        });
        $(".select2_no_search").select2({
            minimumResultsForSearch: Infinity
        });
    },
    handleInputChange: function(e, index) {
        if ($("#simple_form").length) {
            return;
        }
        $(".select2_no_search").select2({
            minimumResultsForSearch: Infinity
        });
        if (__KEYUP_DELAY == undefined) __KEYUP_DELAY = 1000;
        if (_timeoutId != null) clearTimeout(_timeoutId);
        _timeoutId = setTimeout(function() {
            if (
                e != null &&
                $(e.target).parents(".qr_page_component_card").length == 0
            ) {
                return;
            }
            let parent, component;
            if (e == null) {
                parent = $($("#page-tab-input-content .qr_page_component_card")[index]);
                component = parent.data("type");
            } else {
                index = $(e.target).parents(".qr_page_component_card").index();
                component = $(e.target).parents(".qr_page_component_card").data("type");
                parent = $(e.target).parents(".qr_page_component_card");
            }
            Array.from(
                $("#qr_page_component_container .qr_page_component_card")
            ).forEach((ele, index) => {
                QRPageComponents.components[index].card_enable = $(ele)
                    .find("input[name=card_enable]")
                    .prop("checked") ?
                    1 :
                    0;
            });
            let common_data = {
                component,
                card_background: $(parent)
                    .find("input[name=card_bg_enable]")
                    .prop("checked") ?
                    1 :
                    0,
                card_enable: $(parent).find("input[name=card_enable]").prop("checked") ?
                    1 :
                    0,
                card_open: $(parent)
                    .find(".qr_page_component_card_body")
                    .hasClass("show") ?
                    1 :
                    0,
                _id: typeof QRPageComponents.components[index]["_id"] == "undefined" ?
                    QRPageComponents.getUniqueId() :
                    QRPageComponents.components[index]["_id"],
            };

            let component_data = ComponentLists[component].getInputData(
                index,
                parent
            );
            QRPageComponents.components[index] = {
                ...common_data,
                ...component_data,
            };
            QRPageComponents.prepareHtml();
        }, __KEYUP_DELAY);
    },
    getPasscodeUI: function() {
        let passcodeConfig = extractDataFromArray(
            QRPageComponents.page_setting, ["passcode"], {}
        );
        return (
            `<div>
                    <h3>` +
            extractDataFromArray(passcodeConfig, ["title"], "") +
            `</h3>
                    <p style="margin-bottom:24px">` +
            extractDataFromArray(passcodeConfig, ["desc"], "") +
            `</p>
                    <div style="margin-bottom:8px">` +
            extractDataFromArray(passcodeConfig, ["input_label"], "") +
            `</div>
                    <div><input id="passcode"  type="text" /></div>
                    <button class="confirm_btn">` +
            extractDataFromArray(passcodeConfig, ["btn_label"], "") +
            `</button>
                </div>`
        );
    },
    getPrivacyPopupUI: function() {
        let privacyAlertConfig = extractDataFromArray(
            QRPageComponents.page_setting, ["privacyAlert"], {}
        );
        let secondaryLink = extractDataFromArray(
            privacyAlertConfig, ["sec_btn_link"],
            ""
        );
        secondaryLink = secondaryLink.trim();
        secondaryLink =
            secondaryLink == "#" || secondaryLink == "" ?
            "https://www.qrcodechimp.com" :
            secondaryLink;
        let footerLink = extractDataFromArray(
            privacyAlertConfig, ["footer_link"],
            ""
        );
        footerLink = footerLink.trim();
        footerLink =
            footerLink == "#" || footerLink == "" ?
            "https://www.qrcodechimp.com" :
            footerLink;
        return (
            `<div class="privacy_popup">
                    <h3>` +
            extractDataFromArray(privacyAlertConfig, ["title"], "") +
            `</h3>
                    <p style="margin-bottom:24px">` +
            extractDataFromArray(privacyAlertConfig, ["desc"], "") +
            `</p>
                    <button class="confirm_btn">` +
            extractDataFromArray(privacyAlertConfig, ["confirm_btn_label"], "") +
            `</button>
                    ` +
            (parseInt(
                    extractDataFromArray(privacyAlertConfig, ["sec_btn_enable"], "0")
                ) ?
                `
                    <a class="secondary_btn" href="` +
                checkAndAdjustURL(secondaryLink) +
                `">` +
                extractDataFromArray(privacyAlertConfig, ["sec_btn_label"], "") +
                `</a>` :
                "") +
            `
                    <a class="footer_link" href="` +
            checkAndAdjustURL(footerLink) +
            `">` +
            extractDataFromArray(privacyAlertConfig, ["footer_text"], "") +
            `</a>
                    
                </div>
                `
        );
    },
    prepareHtml: function(preview = 0) {
        QRPageComponents._touched = true;
        QRPageComponents.page_setting =
            page == "displayPage" ?
            extractDataFromArray(__savedQrCodeParams, ["page_setting"], {}) :
            QRPageComponents.fetchPageSettings();
        QRPageComponents.preview = preview;
        if (!preview) {
            $(".select2_no_search").select2({
                minimumResultsForSearch: Infinity
            });
        }
        let innerHtml = "";
        let privacyAlert = false;
        if (page == "displayPage") {
            if (
                parseInt(
                    extractDataFromArray(
                        QRPageComponents.page_setting, ["privacyAlert", "enable_privacyAlert"],
                        0
                    )
                )
            ) {
                privacyAlert = true;
            }
        }

        if (privacyAlert && !QRPageComponents._privacyConfirmed) {
            QRPageComponents.setContentToIFrame(
                `
            <div class="qrc_page_wrapper_privacy" style="">
                ` +
                QRPageComponents.getPrivacyPopupUI() +
                `
            </div>`,
                1
            );
            return;
        }

        if (!Array.isArray(QRPageComponents.components) &&
            typeof QRPageComponents.components != "undefined"
        ) {
            QRPageComponents.components = Object.values(QRPageComponents.components);
        }
        QRPageComponents._contact_button_html = "";
        QRPageComponents.components.forEach((component, index) => {
            if (
                empty(component) ||
                empty(extractDataFromArray(component, ["component"]))
            ) {
                return;
            }
            QRPageComponents.components[index]["_id"] =
                typeof QRPageComponents.components[index]["_id"] == "undefined" ?
                QRPageComponents.getUniqueId() :
                QRPageComponents.components[index]["_id"];
            if (
                typeof ComponentLists[component.component]["getPreviewHtml"] !=
                "undefined" &&
                parseInt(extractDataFromArray(component, ["card_enable"], 1))
            ) {
                innerHtml += ComponentLists[component.component].getPreviewHtml(
                    component,
                    index
                );
            }
        });
        //Make sure to Remove JS inserted by user, we are letting other tags be there, even though they may break html
        innerHtml = cleanJSTags(innerHtml);
        let bg_img = extractDataFromArray(
            QRPageStyleComponents.style, ["bg_img"],
            ""
        );
        if (bg_img.endsWith(".mp4")) {
            QRPageComponents.setContentToIFrame(
                `<div class="qrc_page_wrapper video_bg thinScrollBar" style="display:none;">
                                                    <video autoplay muted playsinline loop>
                                                        <source src="` +
                bg_img +
                `" type="video/mp4" data-wf-ignore="true">
                                                    </video>
                                                    <div class="qrc_page_inner">` +
                innerHtml +
                `</div>
                                                    ` +
                QRPageComponents.addExtraButtons() +
                `
                                                    
                                                </div>`
            );
        } else {
            if (QRPageComponents.useOldTemplateStyle()) {
                QRPageComponents.setContentToIFrame(
                    `<div class="qrc_page_wrapper thinScrollBar"  style="display:none;">
                                            <div class="qrc_page_cover" style="background-image: url('` +
                    bg_img +
                    `');"></div>
                                            <div class="qrc_page_inner qrc_page_inner_2" style="background:` +
                    extractDataFromArray(
                        QRPageStyleComponents.style, ["primary_bg_color"],
                        "#061244"
                    ) +
                    `">` +
                    innerHtml + QRPageComponents.checkAndGetWaterMark() +
                    `</div>
                                            ` +
                    QRPageComponents.addExtraButtons() +
                    `
                                        </div>`
                );
            } else {
                QRPageComponents.setContentToIFrame(
                    `<div class="qrc_page_wrapper thinScrollBar" style="display:none;">
                                            <div class="pg_background" style="background-image: url('` +
                    bg_img +
                    `');"></div>
                                            <div class="qrc_page_inner">` +
                    innerHtml + QRPageComponents.checkAndGetWaterMark() +
                    `</div>
                                            ` +
                    QRPageComponents.addExtraButtons() +
                    `
                                        </div>`
                );
            }
        }
    },
    useOldTemplateStyle: function() {
        __savedQrCodeParams =
            typeof __savedQrCodeParams == "undefined" ? {} : __savedQrCodeParams;
        let page_type = QRPageComponents.getPageName();
        if (
            extractDataFromArray(__savedQrCodeParams, ["page"], page_type) ==
            "digital-business-card" &&
            QRPageComponents.selected_template == 4
        ) {
            return true;
        } else if (
            extractDataFromArray(__savedQrCodeParams, ["page"], page_type) ==
            "digital-business-cards" &&
            QRPageComponents.selected_template == 4
        ) {
            return true;
        } else if (
            extractDataFromArray(__savedQrCodeParams, ["page"], page_type) ==
            "coupon-code" &&
            QRPageComponents.selected_template == 1
        ) {
            return true;
        } else if (
            extractDataFromArray(__savedQrCodeParams, ["page"], page_type) ==
            "pdf-gallery" &&
            QRPageComponents.selected_template == 1
        ) {
            return true;
        } else if (
            extractDataFromArray(__savedQrCodeParams, ["page"], page_type) ==
            "multi-url" &&
            QRPageComponents.selected_template == 3
        ) {
            return true;
        } else if (
            extractDataFromArray(__savedQrCodeParams, ["page"], page_type) ==
            "multi-url" &&
            QRPageComponents.selected_template == 4
        ) {
            return true;
        } else if (
            extractDataFromArray(__savedQrCodeParams, ["page"], page_type) ==
            "medical-alert" && [3, 5, 8, 9].indexOf(QRPageComponents.selected_template) > -1
        ) {
            return true;
        } else if (
            extractDataFromArray(__savedQrCodeParams, ["page"], page_type) ==
            "businesspage" && [0, 1, 2].indexOf(QRPageComponents.selected_template) > -1
        ) {
            return true;
        }
        return false;
    },
    setContentToIFrame: function(content, hideLoaderDiv = 0) {
        // if($("#qr_page_prev").length <= 0) {
        //     return;
        // }
        let scroll = 0;
        let vcf_url = "___vcf___";
        let iframe = document.createElement("iframe");
        if (!QRPageComponents.preview) {
            if ($("#qr_page_prev iframe").length > 0) {
                try {
                    $($("#qr_page_prev iframe")[0].contentDocument.body)
                        .find(".qrc_page_wrapper")
                        .css("height", "739px");
                    scroll = $($("#qr_page_prev iframe")[0].contentDocument.body)
                        .find(".qrc_page_wrapper")
                        .scrollTop();
                } catch (e) {}
            }
            showLoaderOnBlock("#qr_page_prev");
            $("#qr_page_prev iframe").remove();
            iframe.className = "landing_page_iframe";
            iframe.onload = function() {
                hideLoader("#qr_page_prev");
                if (
                    document.querySelector(".landing_page_iframe").contentWindow
                    .renderDownloadVcfElement != undefined
                ) {
                    document
                        .querySelector(".landing_page_iframe")
                        .contentWindow.renderDownloadVcfElement();
                }
            };
            //document.querySelector("#qr_page_prev").append(iframe)
            $("#qr_page_prev").append(iframe);
        } else {
            vcf_url =
                "/user/services/openapi?cmd=downloadVcf&id=" +
                location.pathname.split("/")[2];
        }

        // if (content.indexOf("/assets/css/landingpage.css") == -1) {
        //     content = content.cleanReplace('</head>', '<link rel="stylesheet" href="' + location.origin + '/home/abishek/company_repos/qrcodechimp/php/user/view/digital-business-card/style.css' + '" as="style" ></head>')
        // }
        // content = content.cleanReplace('</head>', '<script src="' + location.origin + '/assets/js/jquery-slim.min.js' + '" ></script></head>')
        // content = content.cleanReplace('</head>', '<script src="' + location.origin + '/assets/js/landingpage.js' + '" ></script></head>')

        // <link rel="stylesheet" href="/view/common/css/common.css" type="text/css">
        let card_config = extractDataFromArray(
            QRPageStyleComponents.style, ["card"], {}
        );
        let card_style = "";
        if (extractDataFromArray(card_config, ["enable"], 1)) {
            card_style =
                `
                            :root {--qrc-card-bg:` +
                extractDataFromArray(card_config, ["bg_color"], "#fff") +
                `;}
                            :root {--qrc-border-radius:` +
                extractDataFromArray(card_config, ["border_radius"], "18") +
                `px;}
                            :root {--qrc-box-shadow:` +
                extractDataFromArray(card_config, ["x"], 0) +
                `px ` +
                extractDataFromArray(card_config, ["y"], 0) +
                `px ` +
                extractDataFromArray(card_config, ["blur"], 0) +
                `px ` +
                extractDataFromArray(card_config, ["spread"], 0) +
                `px ` +
                extractDataFromArray(card_config, ["shadow_color"], "#333") +
                `;}
                            .qr_cc_card{
                                background-color : var(--qrc-card-bg);
                                border-radius : var(--qrc-border-radius);
                                box-shadow : var(--qrc-box-shadow);
                            }
                        `;
        }
        const page_settings = QRPageComponents.fetchPageSettings();
        const lock_code_settings = extractDataFromArray(
            page_settings, ["lock_code"], {}
        );
        if (!empty(lock_code_settings)) {
            if (!empty(
                    extractDataFromArray(lock_code_settings, ["enable_lock_code"], 1)
                )) {
                let title = "",
                    desc = "",
                    lock_img = "";
                if (!empty(extractDataFromArray(lock_code_settings, ["title"], ""))) {
                    title =
                        `<div class="qrc_lock_screen_title">` +
                        extractDataFromArray(lock_code_settings, ["title"], "") +
                        `</div> `;
                }
                if (!empty(extractDataFromArray(lock_code_settings, ["desc"], ""))) {
                    desc =
                        `<div class="qrc_lock_screen_des">` +
                        extractDataFromArray(lock_code_settings, ["desc"], "") +
                        `</div> `;
                }
                if (!empty(
                        extractDataFromArray(lock_code_settings, ["lock_img_enable"], 1)
                    )) {
                    lock_img =
                        `<div class="qrc_lock_screen_img"><img src="` +
                        extractDataFromArray(lock_code_settings, ["lock_img"], "") +
                        `" width="160"/></div>`;
                }
                content +=
                    `<div class="qrc_lock_screen" style="display:none;">
                                ` +
                    lock_img +
                    ` 
                                ` +
                    title +
                    ` 
                                ` +
                    desc +
                    `                
                            </div>`;
            }
        }

        let lockEnable = extractDataFromArray(
            QRPageComponents.page_setting, ["lock_code"], {}
        );

        let privacyEnable = parseInt(
            extractDataFromArray(
                QRPageComponents.page_setting, ["privacyAlert", "enable_privacyAlert"],
                0
            )
        );

        let showAfterLock = typeof _show_after_lock != 'undefined' ? parseInt(_show_after_lock) : 0;

        let lockImageLink = typeof lockEnable['lock_img'] == 'undefined' ? "" : lockEnable['lock_img'].split(":")[1];

        let js_include =
            (hideLoaderDiv ?
                `
        const confirmButton = document.querySelector(".privacy_popup .confirm_btn")
        confirmButton.addEventListener('click', () => {
            QRPageComponents._privacyConfirmed = true;
            QRPageComponents.prepareHtml(1)
        })` :
                `$(".qr_page_loader").show();`) +
            (!QRPageComponents.preview ?
                `
          let page = "event-ticket";
          let _short_url_domain = "` +
                $(".short_url_slug_prepend")[0].innerText +
                `";` :
                "") +
            `;$(".qrc_page_wrapper").hide()
                            $(".qrc_addtocontact").on("click", function(e){
                                e.preventDefault()
                                if(window.self !== window.top)
                                {
                                    return;
                                }
                                location.href = "` +
            vcf_url +
            `";
                            })
                            $(document).on("click", "#btn_page_qr_code", function(e){
                                $(".qrc_addtohome_info").hide()
                                $("body").addClass("hideoverflow");
                                $('.qrc_addtohomescreen').show()
                                $("#qrc_page_qrcode_popup").addClass("show")
                            })
                          ` +
            ComponentLists.forms.getListeners() +
            `
                            $(document).on("click", "#btn_share_page", function(e){
                                if (navigator.share && isMobile.any()) {
                                    navigator.share({
                                        title: document.title,
                                        url: checkAndAdjustURL(_short_url_domain+"/"+__savedQrCodeParams.short_url, 'https://')
                                    }).then(() => {
                                        // SwalPopup.showSingleButtonPopup({
                                        //     icon : "success",
                                        //     text : 'Thanks for sharing!',
                                        //     confirmButtonText: 'Close'
                                        // })
                                    }).catch(console.error);
                                } 
                            })
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
                                    html: \`<div>
                                            ` + (extractDataFromArray(lockEnable, ['lock_img_enable'], 0) == 1 ? '<img src="' + lockImageLink + '" style="max-width: 100%; margin-top:20px" />' : '') + `
                                            <h3>` + extractDataFromArray(lockEnable, ['title'], '') + `</h3>
                                            <p>` + extractDataFromArray(lockEnable, ['desc'], '') + `</p>
                                        </div>\`, 
                                    showConfirmButton: false, 
                                    showCloseButton: true, 
                                    closeButtonHtml: \`<i class="icon-remove_1" style="color:black;border:1px solid #C2C6D9; border-radius:50%; font-size:30px" ></i>\`,
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
                                        ` + (QRPageComponents.preview ? 'document.querySelector(".qrc_page_wrapper")?document.querySelector(".qrc_page_wrapper").scrollIntoView():null' : '') + `
                                        ` + (showAfterLock ? 'showLockQRCodePopup()' : '') + `
                                    }else{
                                        $(".qrc_lock_screen").show()
                                    }
                                    if(window.self !== window.top)
                                    {
                                        setTimeout(function() {
                                            $(document.body).find(".qrc_page_wrapper").scrollTop(` +
            scroll +
            `)
                                            // document.body.children[2].scrollBy(0,` +
            scroll +
            `);
                                        }, 100)
                                    }
                                    
                                }, 1000)
                            }
                            ` +
            (showAfterLock == 1 ? `pageInit(0)` : privacyEnable && QRPageComponents._privacyConfirmed ?
                `pageInit(0)` :
                `
                            $.post("/user/services/openapi", {cmd : 'logScan' , path : location.pathname, same_window : window.self !== window.top?1:0} , function(response){
                                let lock_tag = response.errorCode;
                                pageInit(lock_tag)
                            })`) +
            `
                            
                           `;
        if (page == "displayPage") {
            js_include += QRPageComponents.getAddToHomeScreenListenser();
        }
        if (typeof _favicon == "undefined") {
            _favicon = "___favicon___";
        }
        //just a fix in case we do not provide user_info somewhere else ::ToDo:: check if this is ok
        if (typeof user_info == "undefined") {
            user_info = {};
        }
        if (!empty(
                extractDataFromArray(QRPageStyleComponents, ["style", "ld_img"], "")
            ) ||
            typeof _loader_img == "undefined"
        ) {
            _loader_img = extractDataFromArray(
                QRPageStyleComponents.style, ["ld_img"],
                extractDataFromArray(
                    user_info, ["default_loader_img"],
                    "https://cdn0070.qrcodechimp.com/assets/images/def_qrc_loader.png"
                )
            );
        }

        _loader_img = wrapperUrlWithCdnS3(_loader_img);
        /*_loader_img.replace(
                  /qrcodechimp.s3.amazonaws.com/gi,
                  "cdn0030.qrcodechimp.com"
              );*/

        let g_tag_code = "";
        try {
            if (
                typeof _gtag_ids == "object" &&
                !empty(_gtag_ids) &&
                _gtag_ids.length > 0
            ) {
                _gtag_ids.forEach((tag_id) => {
                    g_tag_code +=
                        `  <script async src="https://www.googletagmanager.com/gtag/js?id=` +
                        tag_id +
                        `"></script>
                <script>
                window.dataLayer = window.dataLayer || [];
                
                function gtag() {
                    dataLayer.push(arguments);
                }
                gtag('js', new Date());
                
                gtag('config', "` +
                        tag_id +
                        `");
                </script>`;
                });
            }
        } catch (err) {
            console.log(err.message);
        }
        let custom_css = extractDataFromArray(
            QRPageStyleComponents, ["style", "custom_css"],
            ""
        );
        if (custom_css != "") {
            custom_css = "<style>" + custom_css + "</style>";
        }
        let custom_css_user = extractDataFromArray(
            QRPageStyleComponents, ["style", "custom_css_user"],
            ""
        );
        if (custom_css_user != "") {
            custom_css_user = "<style>" + custom_css_user + "</style>";
        }

        let style =
            `<style>
                        :root {--qrc-primary:` +
            extractDataFromArray(
                QRPageStyleComponents.style, ["primary_bg_color"],
                "#061244"
            ) +
            `;}
                        :root {--qrc-secondary: ` +
            extractDataFromArray(
                QRPageStyleComponents.style, ["secondary_bg_color"],
                "#ffeea0"
            ) +
            `;}
                        :root {--qrc-text-primary: ` +
            extractDataFromArray(
                QRPageStyleComponents.style, ["primary_text_color"],
                "#333333"
            ) +
            `;}
                        :root {--qrc-text-secondary: ` +
            extractDataFromArray(
                QRPageStyleComponents.style, ["secondary_text_color"],
                "#DDDDDD"
            ) +
            `;}
                        :root {--qrc-profile-primary: ` +
            extractDataFromArray(
                QRPageStyleComponents.style, ["primary_profile_text_color"],
                "#333333"
            ) +
            `;}
                        :root {--qrc-profile-secondary: ` +
            extractDataFromArray(
                QRPageStyleComponents.style, ["secondary_profile_text_color"],
                "#DDDDDD"
            ) +
            `;}
                        ` +
            card_style +
            `
                    </style>` +
            custom_css +
            custom_css_user +
            QRPageStyleComponents.styleComponentWrappers.font_style.fonts[
                extractDataFromArray(QRPageStyleComponents.style, ["font"], "default")
            ].src;

        let qrLibHtml = "";
        if (
            page == "displayPage" &&
            typeof _qr_img_path != "undefined" &&
            empty(_qr_img_path)
        ) {
            qrLibHtml =
                `
            <script>
                // let scriptPaths = ["/assets/js/html2canvas.min.js", "/assets/js/base64.js", "/assets/svg/lib/qrcode.js", "/assets/svg/lib/qr-options-common.js", "/assets/svg/lib/qrcode-ext.js", "/assets/svg/lib/qr-options-actions.js"]
                let scriptPaths = ["/files?l=/assets/js/html2canvas.min.js,base64.js;/assets/svg/lib/qrcode.js,qr-options-common.js,qrcode-ext.js,qr-options-conf.js,qr-options-display.js,qr-options-actions.js&v=` +
                new Date().getTime() +
                `"]
                scriptPaths.forEach(scriptPath=>{
                    let script = document.createElement("script")
                    script.src = wrapperUrlWithCdn(scriptPath)
                    script.onload = function(){
                        createQRCodeWithoutDom(__savedQrCodeOptions)
                    }
                    document.body.append(script)
                })

            </script>`;
        }
        // else if (page == "event-ticket") {
        //     _qrOptions.SVG_defs = typeof _qrOptions.SVG_defs == "undefined" ? SVG_defs : _qrOptions.SVG_defs
        //     let check = extractDataFromArray(__savedQrCodeParams, ['id'], '')
        //     qrLibHtml =
        //         `
        //   <script>
        //       if(typeof __savedQrCodeParams == "undefined"){
        //         __savedQrCodeParams = {short_url : '` +
        //         (__savedQrCodeParams.short_url == undefined
        //             ? $("#short_url_input").val()
        //             : __savedQrCodeParams.short_url) +
        //         `', id : '` + (__savedQrCodeParams.id == undefined ? extractIdFromUrl(location.pathname) : __savedQrCodeParams.id) + `', qr_img : '`
        //         + (__savedQrCodeParams.qr_img == undefined ? check : __savedQrCodeParams.qr_img) + `'}
        //       }
        //       // let scriptPaths = ["/assets/js/html2canvas.min.js", "/assets/js/base64.js", "/assets/svg/lib/qrcode.js", "/assets/svg/lib/qr-options-common.js", "/assets/svg/lib/qrcode-ext.js", "/assets/svg/lib/qr-options-actions.js"]
        //       let scriptPaths = ["/files?l=/assets/js/html2canvas.min.js,base64.js;/assets/svg/lib/qrcode.js,qr-options-common.js,qrcode-ext.js,qr-options-conf.js,qr-options-display.js,qr-options-actions.js&v=` +
        //         new Date().getTime() +
        //         `"]
        //       scriptPaths.forEach(scriptPath=>{

        //           let script = document.createElement("script")
        //           script.src = scriptPath
        //           script.onload = function(){
        //             reCreateQRCodeWithoutDom(` +
        //         JSON.stringify(_qrOptions) +
        //         `)
        //           }
        //           document.body.append(script)
        //       })

        //   </script>`;
        // }
        let scriptHtml =
            `<script type="text/javascript" src="` +
            wrapperUrlWithCdn("/assets/js/jquery-slim.min.js") +
            `"></script>
        <script type="text/javascript" src="` +
            wrapperUrlWithCdn("/assets/js/html2canvas.min.js") +
            `"></script>
        <script type="text/javascript" src="` +
            wrapperUrlWithCdn("/view/common/js/fileSaver.js") +
            `"></script> 
        <script type="text/javascript" src="` +
            wrapperUrlWithCdn("/view/common/js/plugins/sweetalert2.all.min.js") +
            `"></script> 
            <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
            <script type="text/javascript" src="` +
            wrapperUrlWithCdn("/assets/js/lightbox-plus-jquery.js") +
            `"></script>
      
                        ` +
            (!QRDesignComponents.preview && page !== 'displayPage' ?
                `
                <script type="text/javascript" src="` +
                wrapperUrlWithCdn("/view/common/js/common.js") +
                `"></script>
                <script type="text/javascript" src="` +
                wrapperUrlWithCdn("/view/common/js/app.js") +
                `"></script>` : "") +
            `
                        ` +
            (QRDesignComponents.preview ? "" : g_tag_code) +
            qrLibHtml +
            `
                        <script>      
                        ` +
            js_include +
            `</script>`;

        let body =
            ` <body class="notranslate" style="overflow:hidden !important;font-family: ` +
            QRPageStyleComponents.styleComponentWrappers.font_style.fonts[
                extractDataFromArray(QRPageStyleComponents.style, ["font"], "default")
            ].style +
            `;"> 
                        <div class="qr_page_loader" style="` +
            (hideLoaderDiv ? "display:none;" : "") +
            `">
                            <img class="loader_img" src="` +
            _loader_img +
            `" />
                        </div>
                        
                        ` +
            QRPageComponents.getPageQRCodePreviewHtml() +
            `
                        ` +
            content +
            `
                        
                    </body>`;
        let head =
            `<!-- <link rel="manifest" href="` +
            wrapperUrlWithCdn(
                `/user/services/manifest?cmd=getAddToHomeScreenManifest&short_url=` +
                location.pathname.split("/page/")[1]
            ) +
            `"> -->
                    <link rel="stylesheet" href="` +
            wrapperUrlWithCdn("/assets/css/font.css") +
            `" type="text/css">
                    <link rel="stylesheet" href="` +
            wrapperUrlWithCdn("/assets/css/style.css") +
            `" as="style" >
                    <link rel="stylesheet" href="` +
            wrapperUrlWithCdn("/view/digital-business-card/style.css") +
            `" as="style" >
                    <link rel="stylesheet" href="` +
            wrapperUrlWithCdn("/assets/css/lightbox.css") +
            `" as="style" >
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />`;

        if (!QRPageComponents.preview) {
            content =
                `<html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    
                    <meta property="og:title" content="` +
                QRPageComponents.profile_name +
                `">
                    <title>` +
                QRPageComponents.profile_name +
                `</title>
                    <link rel="icon" href="` +
                _favicon +
                `" type="image/x-icon" />
                    <link rel="shortcut icon" href="` +
                _favicon +
                `" type="image/x-icon" />
                    <link rel="apple-touch-icon" href="` +
                _favicon +
                `" type="image/x-icon" />
                    ` +
                head +
                `
                    <!-- Custom CSS -->` +
                style +
                `
                    <style> .qrc_page_wrapper{height : 798px} </style>
                    </head>
                ` +
                body +
                scriptHtml +
                `  
            </html>`;
            iframe.srcdoc = content;
            hideLoader("#qr_page_prev");
        } else {
            // document.open();
            // document.write(content);
            // document.close();
            /*
                              //var script = document.createElement('script');
                  //script.innerHTML = js_include;
                  //document.getElementsByTagName('head')[0].appendChild(script);*/
            document.children[0].children[1].style.fontFamily =
                QRPageStyleComponents.styleComponentWrappers.font_style.fonts[
                    extractDataFromArray(QRPageStyleComponents.style, ["font"], "default")
                ].style;
            document.getElementsByTagName("head")[0].innerHTML =
                document.getElementsByTagName("head")[0].innerHTML + style;
            document.children[0].children[1].innerHTML = body;
            $("head").append(scriptHtml);
        }
    },
    saveQRCode: function(callback = null, forAutoSave = false) {
        QRPageComponents._save_callback = callback;
        /**Check if action called from bulk upload page */
        if (getUrlParameterByName("bulk")) {
            if (QRFunctions.isQRSaved()) {
                BulkUploadHandler.saveBulkRecAndTransformExisting(page, true);
            } else {
                BulkUploadHandler.createBulkUpload(page, true);
            }
            return;
        }

        if (empty($("input[name=template_name]").val())) {
            if (!$("#folder-select").hasClass("select2-hidden-accessible")) {
                $("#folder-select").select2({
                    placeholder: "Select Folder",
                    templateResult: function(data, container) {
                        if (data.element) {
                            $(container).addClass($(data.element).attr("class"));
                        }
                        return data.text;
                    },
                });
            }
            $("#short_url_input_popup").val($("#short_url_input").val());
            if (
                empty($("input[name=id]").val()) ||
                $("input[name=id]").val() == "new"
            ) {
                $(".short_url_slug_input").show();
            }

            $("#template_name_modal").modal("show");
            return;
        }
        short_url_code = $("#short_url_input_popup").val();
        if (short_url_code.at(0) == "#") {
            short_url_code = "";
        }
        if (empty(short_url_code)) {
            short_url_code = $(".short_url_data").text();
            if (short_url_code.includes("/r/")) {
                short_url_code = short_url_code.split("/r/")[1];
            } else if (short_url_code.includes("//")) {
                short_url_code = short_url_code.split("//")[1].split("/")[1];
            } else {
                short_url_code = short_url_code.split("/")[1];
            }
        }
        if (!empty(short_url_code)) {
            $("input[name=short_url]").val(short_url_code);
        }
        let short_domain = $(".short_url_slug_prepend")[0].innerText;
        let short_url =
            (short_domain.startsWith("https:") ?
                short_domain :
                "https://" + short_domain) + short_url_code;
        _qrOptions.QR_OPTS.content = short_url;
        refreshQRCode();
        let page_config = {
            content: QRPageComponents.components,
            style: QRPageStyleComponents.style,
            selected_template: QRPageComponents.selected_template,
            template_name: $("input[name=template_name]").val(),
            short_url: short_url_code,
            id: $("input[name=id]").val(),
            page: page,
            qr_type: "D",
            style_selected: QRPageStyleComponents.style_selected,
        };
        page_config["page_setting"] = QRPageComponents.fetchPageSettings();
        QRPageComponents.syncShortUrl(short_url);
        let pageHTML = "";

        /**commented because html is now generated on page load */
        // let iframeHtml = $("#qr_page_prev iframe")[0].contentWindow.document.children[0]
        // $(iframeHtml.children[1]).find("#lightboxOverlay").remove()
        // $(iframeHtml.children[1]).find("#lightbox").remove()
        // if ($("#qr_page_prev iframe")[0].contentWindow.document.children.length == 0) {
        //     pageHTML = $("#qr_page_prev iframe")[0].srcdoc
        // } else {
        //     pageHTML = $("#qr_page_prev iframe")[0].contentWindow.document.children[0].innerHTML
        // }
        saveQrCodeTemplate(page_config, pageHTML, callback, forAutoSave);
    },
    fetchPageSettings: function() {
        let page_settings = {};
        if ($("input[name=enable_passcode]").length == 1) {
            page_settings["passcode"] = {};
            page_settings["passcode"]["enable_passcode"] = $(
                    "input[name=enable_passcode]"
                ).prop("checked") ?
                1 :
                0;
            page_settings["passcode"]["passcode"] = $(
                ".passcode_input_wrapper input[name=passcode]"
            ).val();
            page_settings["passcode"]["timeout"] = $(
                ".passcode_input_wrapper input[name=timeout]"
            ).val();
            page_settings["passcode"]["title"] = $(
                ".passcode_input_wrapper input[name=title]"
            ).val();
            page_settings["passcode"]["desc"] = $(
                ".passcode_input_wrapper textarea[name=desc]"
            ).val();
            page_settings["passcode"]["input_label"] = $(
                ".passcode_input_wrapper input[name=input_label]"
            ).val();
            page_settings["passcode"]["btn_label"] = $(
                ".passcode_input_wrapper input[name=btn_label]"
            ).val();
        }
        if ($("input[name=enable_privacyAlert]").length == 1) {
            page_settings["privacyAlert"] = {};
            page_settings["privacyAlert"]["enable_privacyAlert"] = $(
                    "input[name=enable_privacyAlert]"
                ).prop("checked") ?
                1 :
                0;
            page_settings["privacyAlert"]["title"] = $(
                ".privacyAlert_input_wrapper input[name=title]"
            ).val();
            page_settings["privacyAlert"]["desc"] = $(
                ".privacyAlert_input_wrapper textarea[name=desc]"
            ).val();
            page_settings["privacyAlert"]["confirm_btn_label"] = $(
                ".privacyAlert_input_wrapper input[name=confirm_btn_label]"
            ).val();
            page_settings["privacyAlert"]["sec_btn_enable"] = $(
                    "input[name=sec_btn_enable]"
                ).prop("checked") ?
                1 :
                0;
            page_settings["privacyAlert"]["sec_btn_label"] = $(
                ".privacyAlert_input_wrapper input[name=sec_btn_label]"
            ).val();
            page_settings["privacyAlert"]["sec_btn_link"] = $(
                ".privacyAlert_input_wrapper input[name=sec_btn_link]"
            ).val();
            page_settings["privacyAlert"]["footer_text"] = $(
                ".privacyAlert_input_wrapper input[name=footer_text]"
            ).val();
            page_settings["privacyAlert"]["footer_link"] = $(
                ".privacyAlert_input_wrapper input[name=footer_link]"
            ).val();
        }
        if ($("input[name=email_on_scan_enable]").length == 1) {
            page_settings["email_on_scan"] = {
                enable: $("input[name=email_on_scan_enable]").prop("checked") ? 1 : 0,
                emails: $("[name=emails]").val(),
            };
        }
        if ($("input[name=style_page_qr_code]").length == 1) {
            page_settings["page_qr_code"] = $("input[name=style_page_qr_code]").prop(
                    "checked"
                ) ?
                1 :
                0;
        }
        if ($("input[name=style_page_sharing]").length == 1) {
            page_settings["page_sharing"] = $("input[name=style_page_sharing]").prop(
                    "checked"
                ) ?
                1 :
                0;
        }

        if ($("input[name=enable_lock_code]").length == 1) {
            let lock_img = $(
                ".lock_code_input_wrapper .img_uploaded_card.selected_img"
            ).css("background-image");
            if (!empty(lock_img)) {
                lock_img = lock_img.split('"')[1];
            }
            page_settings["lock_code"] = {
                enable_lock_code: $("input[name=enable_lock_code]").prop("checked") ?
                    1 :
                    0,
                scan_count: $(".lock_code_input_wrapper input[name=scan_count]").val(),
                lock_by_owner: $(
                        ".lock_code_input_wrapper input[name=lock_by_owner]"
                    ).prop("checked") ?
                    1 :
                    0,
                show_after_lock: $(
                        ".lock_code_input_wrapper input[name=show_after_lock]"
                    ).prop("checked") ?
                    1 :
                    0,
                title: $(".lock_code_input_wrapper input[name=title]").val(),
                desc: $(".lock_code_input_wrapper input[name=desc]").val(),
                lock_img_enable: $(
                        ".lock_code_input_wrapper input[name=enable_pr]"
                    ).prop("checked") ?
                    1 :
                    0,
                desc: $(".lock_code_input_wrapper input[name=desc]").val(),
                lock_img,
            };
        }

        return page_settings;
    },
    getVcardData: function() {
        let profile,
            contact,
            links = [],
            social_link = [];
        QRPageComponents.components.forEach((component) => {
            if (component.component == "profile") {
                profile = component;
            } else if (component.component == "contact") {
                contact = component;
            } else if (component.component == "web_links") {
                links = links.concat(component.links);
            } else if (component.component == "social_link") {
                social_link = social_link.concat(component.links);
            }
        });

        let itemCount = 1;

        let full_name = extractDataFromArray(profile, ["name"], "");
        let first_name = full_name.split(" ")[0];
        let last_name =
            full_name.split(" ").length > 1 ? full_name.split(" ")[1] : "";
        let name =
            last_name != "" || first_name != "" ?
            `\r\nN:` + last_name + `;` + first_name :
            "";
        var fName = !empty(full_name) ? `\r\nFN:` + full_name : "";

        var org =
            extractDataFromArray(profile, ["company"], "") != "" ?
            `\r\nORG:` + extractDataFromArray(profile, ["company"], "") :
            "";
        var title =
            extractDataFromArray(profile, ["desc"], "") != "" ?
            `\r\nTITLE:` + extractDataFromArray(profile, ["desc"], "") :
            "";
        let img_type = "",
            pic_v = "";
        if (profile.pr_img.endsWith(".jpg") || profile.pr_img.endsWith(".jpeg")) {
            img_type = "JPEG";
        } else if (profile.pr_img.endsWith(".gif")) {
            img_type = "GIF";
        } else if (profile.pr_img.endsWith(".png")) {
            img_type = "PNG";
        }
        if (!empty(img_type)) {
            pic_v =
                "\r\nPHOTO;ENCODING=b;TYPE=" + img_type + ":" + QRPageComponents.pr_64;
        }
        let address = "";
        // var address = `\r\nADR:;;`;
        // address += ($("input[name=street]").val() != "") ? $("input[name=street]").val() + ';' : ';';
        // address += ($("input[name=city]").val() != "") ? $("input[name=city]").val() + ';' : ';';
        // address += ($("input[name=state]").val() != "") ? $("input[name=state]").val() + ';' : ';';
        // address += ($("input[name=zipcode]").val() != "") ? $("input[name=zipcode]").val() + ';' : ';';
        // address += ($("input[name=country]").val() != "") ? $("input[name=country]").val() : '';
        // if (address == `\r\nADR:;;;;;;`) address = '';

        let tel = "",
            email = "",
            url = "";
        contact.contact_infos.forEach((contact_info) => {
            if (contact_info.type == "number") {
                tel +=
                    `\r\nitem` +
                    itemCount +
                    `.TEL;type=` +
                    contact_info.title +
                    `:` +
                    contact_info.number;
                tel += `\r\nitem` + itemCount + `.X-ABLabel:` + contact_info.title;
            } else if (contact_info.type == "email") {
                email +=
                    `\r\nitem` +
                    itemCount +
                    `.EMAIL;` +
                    contact_info.title +
                    `:` +
                    contact_info.email;
                email += `\r\nitem` + itemCount + `.X-ABLabel:` + contact_info.title;
            } else if (contact_info.type == "address") {
                let temp = "\r\nitem" + itemCount + ".ADR:;";
                //need to reverse in .vcf file (address line2 should be before address line1)
                temp += extractDataFromArray(contact_info, ["building"], "") + ";";
                temp += extractDataFromArray(contact_info, ["street"], "") + ";";
                temp += extractDataFromArray(contact_info, ["city"], "") + ";";
                temp += extractDataFromArray(contact_info, ["state"], "") + ";";
                temp += extractDataFromArray(contact_info, ["zip"], "") + ";";
                temp += extractDataFromArray(contact_info, ["country"], "") + ";";

                if (temp != `\r\nitem` + itemCount + `.ADR:;;;;;;`) {
                    temp += `\r\nitem` + itemCount + `.X-ABLabel:` + contact_info.title;
                    address += temp;
                }
            }
            itemCount += 1;
        });
        links.forEach((link) => {
            url += `\r\nitem` + itemCount + `.URL:` + link.url;
            url += `\r\nitem` + itemCount + `.X-ABLabel:` + link.title;
            itemCount += 1;
        });

        social_link.forEach((link) => {
            if (link.type == "email") {
                email +=
                    `\r\nitem` + itemCount + `.EMAIL;` + link.title + `:` + link.url;
                email += `\r\nitem` + itemCount + `.X-ABLabel:` + link.title;
            } else {
                url +=
                    `\r\nitem` + itemCount + `.URL;type=` + link.type + `:` + link.url;
                url += `\r\nitem` + itemCount + `.X-ABLabel:` + link.title;
            }
            itemCount += 1;
        });

        var text =
            `BEGIN:VCARD
VERSION:3.0` +
            name +
            fName +
            org +
            title +
            address +
            tel +
            email +
            pic_v +
            url +
            `
END:VCARD`;
        //console.log(text);
        return text;
    },
    getPrBase64: async function(src) {
        var img = new Image();
        // img.crossOrigin = 'Anonymous';
        let ext = "png";
        if (src.endsWith("jpg")) {
            ext = "jpg";
        } else if (src.endsWith("jpeg")) {
            ext = "jpeg";
        }
        if (src.includes("cdn03.qrcodechimp.com")) {
            src = src.cleanReplace(
                "cdn03.qrcodechimp.com",
                "qrcodechimp.s3.us-east-1.amazonaws.com"
            );
        }
        img.onload = function() {
            var canvas = document.createElement("CANVAS");
            var ctx = canvas.getContext("2d");
            var dataURL;
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL("image/" + ext);
            QRPageComponents.pr_64 = dataURL.cleanReplace(
                /^data:image\/(png|jpg|jpeg);base64,/,
                ""
            );
        };
        img.setAttribute("crossorigin", "anonymous");
        img.src = src;
        // var xhr = new XMLHttpRequest();
        // xhr.onload = function () {
        //     var reader = new FileReader();
        //     reader.onloadend = function () {
        //         QRPageComponents.pr_64 = this.result
        //         // callback(reader.result);
        //     }
        //     reader.readAsDataURL(xhr.response);
        // };
        // xhr.open('GET', src);
        // xhr.responseType = 'blob';
        // xhr.send();
    },
    downloadBulkSampleFile: function() {
        function fitToColumn(arrayOfArray) {
            // get maximum character of each column
            return arrayOfArray[0].map((a, i) => ({
                wch: Math.max(
                    ...arrayOfArray.map((a2) => (a2[i] ? a2[i].toString().length : 0))
                ),
            }));
        }
        let wb = XLSX.utils.book_new();
        let ws_data = QRPageComponents.prepareColumn();
        let ws = XLSX.utils.aoa_to_sheet(ws_data);
        ws["!cols"] = fitToColumn(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
        XLSX.writeFile(wb, "sample-" + page + ".xlsx");
    },
    prepareColumn: function() {
        let sheet_columns = ["QR Name", "Page-code"];
        let sheet_samples = ["QR Name", "Page-code"];
        QRPageComponents.components.forEach((component, index) => {
            if (!empty(extractDataFromArray(component, ["card_enable"], 1))) {
                let getColumnNames = extractDataFromArray(
                    ComponentLists, [component.component, "getColumnNames"],
                    null
                );
                if (!empty(getColumnNames)) {
                    ComponentLists[component.component].getColumnNames(
                        index,
                        sheet_columns,
                        sheet_samples,
                        component
                    );
                }
            }
        });
        return [sheet_columns, sheet_samples];
    },
    addExtraButtons: function() {
        return (
            `<div class="extra_button_wrapper"><div style="display:flex">` +
            QRPageComponents.getPageQRCodeButton() +
            QRPageComponents.getShareButton() +
            `</div>` +
            QRPageComponents._contact_button_html +
            "</div>"
        );
    },
    getPageQRCodeButton: function() {
        if (!(
                (extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
                    "digital-business-card" ||
                    extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
                    "digital-business-cards") &&
                parseInt(
                    extractDataFromArray(
                        QRPageComponents.page_setting, ["page_qr_code"],
                        1
                    )
                )
            )) {
            return "";
        }
        return `<button class="btn " id="btn_page_qr_code"><i class="icon-qrcode"></i></button>`;
    },
    getShareButton: function() {
        if (!(
                (extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
                    "digital-business-card" ||
                    extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
                    "digital-business-cards") &&
                parseInt(
                    extractDataFromArray(
                        QRPageComponents.page_setting, ["page_sharing"],
                        1
                    )
                )
            )) {
            return "";
        }
        return `<button class="btn " id="btn_share_page" ><i class="icon-file_upload_1"></i></button>`;
    },
    getPageQRCodePreviewHtml: function() {
        if (!(
                (extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
                    "digital-business-card" ||
                    extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
                    "digital-business-cards") &&
                parseInt(
                    extractDataFromArray(
                        QRPageComponents.page_setting, ["page_qr_code"],
                        1
                    )
                )
            )) {
            return "";
        }
        let profile_section = "";
        let header_data_available = false;
        QRPageComponents.components.forEach((component) => {
            if (
                component.component == "profile" &&
                parseInt(extractDataFromArray(component, ["card_enable"], 1))
            ) {
                let pr_img = "";
                if (!empty(extractDataFromArray(component, ["name"], "")) &&
                    !empty(extractDataFromArray(component, ["company"], ""))
                ) {
                    header_data_available = true;
                }
                if (parseInt(extractDataFromArray(component, ["enable_pr"], 1))) {
                    let imgT = extractDataFromArray(component, ["pr_img"], 0);
                    if (imgT.indexOf("/") == 0 && imgT.indexOf("//") != 0) {
                        imgT = wrapperUrlWithCdn(imgT); //"https://cdn0070.qrcodechimp.com/" +imgT;
                    } else {
                        imgT = imgT.split(".");
                        if (imgT[imgT.length - 1] !== "gif") {
                            imgT[imgT.length - 2] = imgT[imgT.length - 2] + "_m";
                        }
                        imgT = imgT.join(".");
                    }
                    pr_img =
                        `<div class="qrc_profile_pic_popup" style="background-image: url('` +
                        imgT +
                        `')"></div>`;
                }
                profile_section =
                    `<div class="qrc_profile_inner_info_popup">
                                        ` +
                    pr_img +
                    `
                                        <h2>` +
                    extractEscapeHtmlDataFromArray2(component, ["name"], "") +
                    `</h2>
                                        <p>` +
                    extractEscapeHtmlDataFromArray2(component, ["desc"], "") +
                    `</p>
                                        <p class="qrc_profile_company">` +
                    extractEscapeHtmlDataFromArray2(component, ["company"], "") +
                    `</p>
                                    </div>`;
            }
        });

        let qr_img_path = '';
        if (typeof _qr_img_path == 'undefined' && page != 'displayPage') {
            qr_img_path = $("#qrcode_preview").attr("src")
        } else if (typeof _qr_img_path != 'undefined') {
            qr_img_path = _qr_img_path
            if (!empty(qr_img_path)) {
                let imgT = qr_img_path.split('.')
                if (imgT && !imgT[imgT.length - 2].endsWith("_t")) {
                    imgT[imgT.length - 2] = imgT[imgT.length - 2] + "_t"
                }
                qr_img_path = imgT.join(".")
            }
        }
        let extraWidthStyle = QRPageComponents.preview ? '' : ' style="width:104%;" ';
        return `<div id="qrc_page_qrcode_popup" ${extraWidthStyle}>
                        <button class="btn " id="btn_page_qr_code_close">
                            <i class="icon-cross"></i>
                        </button>
                    <div id="qr_profile_section" style="padding: 40px 0;">
                    ` +
            profile_section +
            `
                    <div class="qrc_profile_qrcode_popup">
                        <img width="200" src="` +
            qr_img_path +
            `?v=` +
            new Date().getTime() +
            `" class="img-fluid" crossorigin="anonymous">
                        </div>
                    </div>
                    <div>
                        Add your Digital Business Card to Wallet
                    </div>
                    <div style="display:flex;justify-content:center;margin:20px;gap : 8px;">
                        <a href="#" class="qrc_btn_add_to_google_wallet"><img height="42"  src="/images/wallet/google_wallet.svg"/></a>
                        <a href="#" class="qrc_btn_add_to_apple_wallet"><img height="42"  src="/images/wallet/apple_wallet.svg"/></a>
                    </div>
                    ` +
            (header_data_available ?
                "" :
                `<div id="wallet_no_data" style="display:none;color : red; margin:10px;">Profile name and sub-heading are required to add a digital business card to Apple or Google Wallet.</div>`) +
            `
                    ` +
            (header_data_available ?
                "" :
                `<div id="wallet_no_data" style="display:none;color : red; margin:10px;">Profile name and sub-heading are required to add a digital business card to Apple or Google Wallet.</div>`) +
            `
                    <div class="qr_popup_button_container">
                        <a href="#" class="qrc_addtohomescreen qrc_btn_add_to_home_screen ` +
            (isMobile.any() && !isSafariBrowser() ? "d-none" : "") +
            `"  >
                            <div class="qrc_action_button_icon">
                                <img src="/images/add_to_homescreen.webp" />
                            </div>                
                            <div class="qrc_addtohomescreen_text">Add to Home Screen </div>
                        </a>
                        <a href="#" class="qrc_addtohomescreen qrc_btn_save_t0_gallery"  >
                            <div class="qrc_action_button_icon">
                                <img src="/images/photo_gallery.webp" />
                            </div>             
                            <div class="qrc_addtohomescreen_text">Add to Gallery</div>   
                        </a>
                    </div>
                    <div class="qrc_addtohome_info" style="display:none;">
                        <img src="` +
            wrapperUrlWithCdn("/assets/images/add_to_homescreen_1.png") +
            `" class="img-fluid">
                        <img src="` +
            wrapperUrlWithCdn("/assets/images/add_to_homescreen_2.png") +
            `" class="img-fluid">
                    </div>
                </div>`

    },
    getAddToHomeScreenListenserFunctions: function() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/service-worker.js").then(() => {
                console.log("Service Worker Registered");
            });
        }
        console.log("loading");
        // Code to handle install prompt on desktop

        let deferredPrompt;
        const addBtn = document.querySelector(".qrc_btn_add_to_home_screen");
        $(".qrc_btn_save_t0_gallery").click(function() {
            html2canvas(document.querySelector("#qr_profile_section"), {
                useCORS: true,
                taintTest: false,
                allowTaint: true,
            }).then((canvas) => {
                canvas.toBlob(function(blob) {
                    saveAs(blob, $(".qrc_profile_inner_info_popup h2").text() + ".png");
                });
            });
        });

        $(".qrc_btn_add_to_apple_wallet").click(function(e) {
            if (document.getElementById("wallet_no_data") != null) {
                e.preventDefault();
                $("#wallet_no_data").show();
                return;
            }
            let templateBrandImg = 1;
            let template_content = getComponentContentFromTemplate(
                QRPageComponents.selected_template
            );
            let template_profile = extractDataFromArray(template_content, ["0"], "");
            templateBrandImg =
                typeof template_profile != "undefined" &&
                typeof template_profile["show_brand_img"] != "undefined" &&
                template_profile["show_brand_img"] ?
                1 :
                0;
            // let profile_pic =
            window.open(
                "/user/services/openapi?cmd=getAppleWalletPass&templateHasBrandImg=" +
                templateBrandImg +
                "&shorturl=" +
                extractDataFromArray(__savedQrCodeParams, ["short_url"], "") +
                "&fullurl=" +
                location.origin +
                location.pathname,
                "_blank"
            );
        });
        $(".qrc_btn_add_to_google_wallet").click(function(e) {
            if (document.getElementById("wallet_no_data") != null) {
                e.preventDefault();
                $("#wallet_no_data").show();
                return;
            }
            let templateBrandImg = 1;
            let template_content = getComponentContentFromTemplate(
                QRPageComponents.selected_template
            );
            let template_profile = extractDataFromArray(template_content, ["0"], "");
            templateBrandImg =
                typeof template_profile != "undefined" &&
                typeof template_profile["show_brand_img"] != "undefined" &&
                template_profile["show_brand_img"] ?
                1 :
                0;
            // let profile_pic =
            window.open(
                "/user/services/openapi?cmd=getGoogleWalletPass&templateHasBrandImg=" +
                templateBrandImg +
                "&shorturl=" +
                extractDataFromArray(__savedQrCodeParams, ["short_url"], "") +
                "&fullurl=" +
                location.origin +
                location.pathname,
                "_blank"
            );
        });
        if (isMobile.iOS()) {
            $(".qrc_btn_add_to_apple_wallet").removeClass("hide");
            if (isSafariBrowser()) {
                if (addBtn != null) {
                    addBtn.addEventListener("click", () => {
                        $(".qrc_addtohome_info").show();
                        $(".qrc_btn_add_to_home_screen").hide();
                        document.getElementById("qrc_page_qrcode_popup").scrollTop = $(
                            ".qrc_addtohome_info"
                        ).offset().top;
                    });
                }
            } else {
                setTimeout(() => {
                    $(".qrc_addtohome_info").hide();
                    $(".qrc_btn_add_to_home_screen").hide();
                }, 1000);
            }
        } else {
            window.addEventListener("beforeinstallprompt", (e) => {
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                e.preventDefault();
                // Stash the event so it can be triggered later.
                deferredPrompt = e;
                // Update UI to notify the user they can add to home screen
            });
            if (addBtn) {
                // debugger
                addBtn.addEventListener("click", () => {
                    // hide our user interface that shows our A2HS button
                    //   addBtn.style.display = 'none';
                    // Show the prompt
                    if (deferredPrompt == null) {
                        alert("Successfully added, thank you!");
                        return;
                    }

                    deferredPrompt.prompt();
                    // Wait for the user to respond to the prompt
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === "accepted") {
                            console.log("User accepted the A2HS prompt");
                        } else {
                            console.log("User dismissed the A2HS prompt");
                        }
                        deferredPrompt = null;
                    });
                });
            }
        }
    },
    getAddToHomeScreenListenser: function() {
        if (!(
                (extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
                    "digital-business-card" ||
                    extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
                    "digital-business-cards") &&
                extractDataFromArray(QRPageComponents.page_setting, ["page_qr_code"], 1)
            )) {
            return "";
        }
        return `$(document).ready(()=>{ setTimeout (() => { QRPageComponents.getAddToHomeScreenListenserFunctions() }) })`;
    },
    setQRImgForFirstTime: function(img) {
        if (
            QRPageComponents._set_image == 0 &&
            (page == "digital-business-card" || page == "digital-business-cards")
        ) {
            try {
                QRPageComponents._set_image = 1;
                $($("#qr_page_prev iframe")[0].contentDocument.body.children[1])
                    .find(".qrc_profile_qrcode_popup img")
                    .attr("src", "");
                $($("#qr_page_prev iframe")[0].contentDocument.body.children[1])
                    .find(".qrc_profile_qrcode_popup img")
                    .attr("src", img);
            } catch {}
        }
    },
    getUniqueId: function() {
        let date = new Date();
        return random_str() + date.getTime();
    },
    generateQRImage: function() {
        if (
            page == "displayPage" &&
            typeof _qr_img_path != "undefined" &&
            empty(_qr_img_path)
        ) {}
    },
    checkAndGetWaterMark: function() {
        if (typeof _include_watermarkC != 'undefined' && _include_watermarkC && typeof _include_watermark != 'undefined' && _include_watermark) {
            let href = getPageIdToUrl(__page_type);
            let html = `<a href="${href}" style="text-decoration:underline;background:#ffffff80;display:flex;border-radius: 32px;padding:16px 22px 16px 20px;gap: 8px;width: fit-content;margin: 50px auto 30px auto;color: #121212;box-shadow: 0px 0px 5px #00000030;flex-shrink: 0;align-items: center;">
            <div><img src="` + wrapperUrlWithCdn('/assets/images/qrChimpIconRound.png') + `" style="display: block;"></div> Get your own page for free!</a>`;
            return html;
        }
        return '';
    },
};

function QRPageComponents_GetPageTypeTemplates(pageType) {
    var selectedPageArr = [];
    if (pageType == "pet-id-tags") {
        selectedPageArr = PetIdTagTemplates;
    } else if (pageType == "event-ticket") {
        selectedPageArr = EventTicketTemplates;
    } else if (pageType == "medical-alert") {
        selectedPageArr = MedicalAlertTemplates;
    } else if (pageType == "businesspage") {
        selectedPageArr = BusinessPageTemplates;
    } else if (pageType == "multi-url") {
        selectedPageArr = MultiURLTemplates;
    } else if (pageType == "coupon-code") {
        selectedPageArr = CouponCodeTemplates;
    } else if (pageType == "pdf-gallery") {
        selectedPageArr = PDFGalleryTemplates;
    } else if (pageType == "forms") {
        selectedPageArr = FormTemplates;
    } else {
        selectedPageArr = DigitalBusinessPageTemplates;
    }

    return selectedPageArr;
}

const QRPageComponentWrapper = {
    contactOptions: {
        mobile: {
            label: 'Mobile',
            icon: 'icon-smartphone_1',
            placeholder: 'Mobile number'
        },
        email: {
            label: 'Email',
            icon: 'icon-email_1',
            placeholder: 'Email'
        },
        sms: {
            label: 'SMS',
            icon: 'icon-textsms_1',
            placeholder: 'Mobile number'
        },
        location: {
            label: 'Location',
            icon: 'icon-pin',
            placeholder: 'Google location URL'
        },
        wechat: {
            label: 'WeChat',
            icon: 'icon-wechat_icon',
            placeholder: 'WeChat ID'
        },
        whatsapp: {
            label: 'Whatsapp',
            icon: 'icon-whatsapp_1',
            placeholder: 'Whatsapp URL'
        },
        fax: {
            label: 'Fax',
            icon: 'icon-contact_1',
            placeholder: 'Fax number'
        },
        tel: {
            label: 'Telephone',
            icon: 'icon-telephone_1',
            placeholder: 'Telephone number'
        }
    },
    emitListeners: function(index, component) {
        let component_listener = extractDataFromArray(
            ComponentLists, [component.component, "listeners"],
            null
        );
        if (!empty(component_listener)) {
            component_listener(index);
        }
    },
    getSwitcheryButton: function(name, on = 0) {
        return (
            `<div class="switchery d-inline">
                    <label class="switch mb-0">
                        <input type="checkbox" ` +
            (parseInt(on) ? "checked" : "") +
            `  name="` +
            name +
            `"  ` +
            (QRPageComponents.isBulkUploadQRCode() ? "disabled" : "") +
            `>
                        <span class="slider round"></span>
                    </label>
                </div>`
        );
    },
    getCheckboxButton: function(on = 0, weekDay = "") {
        return (
            `<div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id=` + weekDay + ` ` +
            (parseInt(on) ? "checked" : "") +
            `  name="` +
            weekDay +
            `"  ` +
            (QRPageComponents.isBulkUploadQRCode() ? "disabled" : "") +
            `>
                <label class="custom-control-label" for=` + weekDay + ` style="color:black">` + (weekDay.charAt(0).toUpperCase() + weekDay.slice(1)) + `</label>
                </div>`
        );
    },
    getImageUploader: function(
        title = "Images",
        selectedImages = [],
        size = "",
        thumbnail_size = "",
        switchButton = false,
        switchState = 0,
        col = 12,
        field_name = "",
        size_position = "top"
    ) {
        let imageHtml = "";
        selectedImages.forEach((image) => {
            imageHtml +=
                `<div class="img_uploaded_card selected_img mr-3 ` +
                field_name +
                `" style="background-image:url('` +
                image +
                `')"></div>`;
        });
        return (
            `
            <div class="col-md-` +
            col +
            ` px-3 mb-3">
                <div class="mb-2">` +
            title +
            ` ` +
            (!empty(size) && size_position == "top" ?
                '<span class="text-muted font-12">' + size + "</span>" :
                "") +
            (switchButton ?
                QRPageComponentWrapper.getSwitcheryButton(
                    "enable_" + field_name.replace("_img", ""),
                    switchState
                ) :
                "") +
            `</div>
                <div class="d-flex img_upload_card_wrapper">
                    ` +
            imageHtml +
            `
                    <div class="img_uploaded_card upload_img mr-3 d-flex justify-content-center align-items-center flex-column">
                        <i class="font-24 icon-file_upload_1 my-2"></i>
                        ` +
            (!empty(thumbnail_size) ?
                '<span class="text-muted font-12">' + thumbnail_size + "</span>" :
                "") +
            `
                    </div>
                    <input class="d-none" type="file" name="pg_upload_image" accept="image/*">
                </div>
                ` +
            (!empty(size) && size_position == "bottom" ?
                '<div class=""><span class="text-muted font-12">' +
                size +
                "</span></div>" :
                "") +
            `
            </div>
        `
        );
    },
    getImagesUploader: function(title = "Images", selectedImages = [], index) {
        let imageHtml = "";
        selectedImages.forEach((image) => {
            if (empty(image.trim())) {
                return;
            }
            imageHtml +=
                `<div class="img_uploaded_card multiple_img mr-3 handle-img mb-2" style="background-image:url('` +
                image +
                `')">
                    <div class="img_action image_css">
                        <a href="#" class="btn text-white"><i class="icon-delete_1 font-14"></i></a>
                    </div>
                </div>`;
        });
        return (
            `
            <div class="col-md-12 px-3 mb-3">
                <div class="mb-3">` +
            title +
            ` <span class="text-muted font-12">(600x600px, 1:1, 4:5 Ratio)</span></div>
                <div class="img_upload_card_wrapper">
                    <div class="images_grid_wrapper" id="images_grid_` +
            index +
            `">
                    ` +
            imageHtml +
            `
                    </div>
                    <div class="img_uploaded_card upload_imgs mr-3 d-flex justify-content-center align-items-center">
                        <i class="font-24 icon-file_upload_1"></i>
                    </div>
                    <input class="d-none" type="file" name="pg_upload_images" accept="image/*">
                </div>
            </div>
        `
        );
    },
    getImageGalleryUploader: function(title = "Images", selectedImages = [], index, viewType) {
        let imageHtml = "";
        selectedImages = validateSelectedImages(selectedImages);
        let isDisabled = '';
        if (viewType == 'slider') {
            isDisabled = 'disabled';
        }
        selectedImages.forEach((image) => {
            if (empty(image['image'].trim())) {
                image['image'] = '';
            }
            imageHtml +=
                `<div class="img_data_div">
                    <div class="action_img_buttons">
                        <div class="img_action">
                            <a href="#" class="btn"><i class="icon-delete_1"></i></a>
                        </div>
                        <div class="img_action_2 handle-img">
                            <a href="#" class="btn"><i class="icon-drag_1"></i></a>
                        </div>
                    </div>
                    <div class="img_data_div_1">
                        <div class="img_uploaded_card multiple_img img_container_div" style="background-image:url('` + extractDataFromArray(image, ['image'], '') + `')">
                        </div>
                        <div class="img_title_link">
                            <div class="d-flex">
                                <input class="form-control" autocomplete="off" name="title"  value="` + extractDataFromArray(image, ['title'], '') + `" type="text" placeholder="Title" ` + isDisabled + `>
                            </div>
                            <div></div>
                            <div class="d-flex">
                                <input class="form-control" autocomplete="off" name="link"  value="` + extractDataFromArray(image, ['link'], '') + `" type="text" placeholder="Link">
                            </div>
                        </div>
                    </div>
                </div>`;
        });
        return (
            `
            <div class="col-md-12 px-3 mb-3">
                <div class="mb-3">` +
            title +
            ` <span class="text-muted font-12">(600x600px, 1:1, 4:5 Ratio)</span></div>
                <div class="img_upload_card_wrapper">
                    <div class="images_grid_wrapper_2" id="images_grid_` +
            index +
            `">
                    ` +
            imageHtml +
            `
                    </div>
                    <div class="img_uploaded_card upload_imgs_2 mr-3 d-flex justify-content-center align-items-center">
                        <i class="font-24 icon-file_upload_1"></i>
                    </div>
                    <input class="d-none" type="file" name="pg_upload_images" accept="image/*">
                </div>
            </div>
        `
        );
    },
    getInputText: function(
        label = "",
        name = "",
        value = "",
        col = 12,
        switch_name = "",
        switch_on = false,
        placeholder = "",
        type = "text",
        className = ""
    ) {
        let switchHtml = "";
        if (!empty(switch_name)) {
            switchHtml = QRPageComponentWrapper.getSwitcheryButton(
                switch_name,
                switch_on
            );
        }
        let minimum = type == "number" ? 'min="1"' : "";
        return (
            `
            <div class="col-md-` +
            col +
            `  px-3">
                <div class="mb-2 d-flex"><span class="mr-2">` +
            label +
            "</span>" +
            switchHtml +
            ` </div>
                <div class="d-flex">
                    <input class="form-control ` +
            className +
            `" autocomplete="off" name="` +
            name +
            `" ` +
            minimum +
            ` value="` +
            unescapeHTML(value) +
            `" type="` +
            type +
            `" placeholder="` +
            placeholder +
            `">
                </div>
                <span id="` +
            className +
            `"></span>
            </div>
        `
        );
    },
    getInputTimeText: function(name = "", value = "") {
        return (
            `<div class='input-group date ` + name + `'>
                <input type='text' class="form-control" name="` + name + `" value="` + value + `" />
                <div class="input-group-append input-group-addon">
                    <button class="btn btn-default time_button_div" type="button"><i class="icon-time"></i></button>
                </div>
            </div>`
        )
    },
    getDateTimePickerInput: function(target = '', useCurrent = true) {
        $(target).datetimepicker({
            format: 'LT',
            useCurrent,
            widgetPositioning: {
                // horizontal: 'right',
                vertical: 'top'
            }
        }).on("dp.change", function(e) {
            $(e.target).parents(".week_row").find("input[type=checkbox]").prop("checked", true)
            QRPageComponents.handleInputChange(e)
        });
    },
    getTextAreaInput: function(label = "", name = "", value = "", rows = 4) {
        return (
            `
            <div class="col-md-12  px-3">
                <div class="mb-2">` +
            label +
            `</div>
                <div class="d-flex">
                    <textarea class="form-control" name="` +
            name +
            `" rows="` +
            rows +
            `">` +
            unescapeHTML(value) +
            `</textarea>
                </div>
            </div>
        `
        );
    },
    getTitleDescSection: function(title = "", desc = "", on = false) {
        return (
            `<div class="col-md-12 title_desc_wrapper">
                    <div class="row mx-0">
                        <div class="mr-2 mb-2" > Title, Description </div>` +
            QRPageComponentWrapper.getSwitcheryButton("header_enable", on) +
            `
                    </div>
                    <div class="row mx-0 title_desc_wrapper_input gray_card mb-4 " style="` +
            (on ? "" : "display:none;") +
            `">
                        ` +
            QRPageComponentWrapper.getInputText("Title", "title", title) +
            `
                        ` +
            QRPageComponentWrapper.getTextAreaInput("Description", "desc", desc) +
            `
                    </div> 
                </div> `
        );
    },
    getWrapperHtml: function(index, component, hide = false) {
        if (empty(extractDataFromArray(component, ["component"], ""))) {
            return (
                `  <div class="card collapse_card mb-3 qr_page_component_card list-group-item ` +
                (QRPageComponents.isBulkUploadQRCode() &&
                    empty(extractDataFromArray(component, ["card_enable"], 0)) ?
                    "d-none" :
                    "") +
                `" ></div>`
            );
        }
        let component_config = extractDataFromArray(
            ComponentLists, [component.component], []
        );
        let fixed_components = ["profile", "contact", "coupon_code", "event_profile"];
        let no_bg_components = ["profile", "event_profile"];
        let skip_component = ["password"];
        if (
            empty(component_config) ||
            skip_component.indexOf(component.component) > 0
        ) {
            return "";
        }

        let hide_action_buttons = QRPageComponents.isBulkUploadQRCode() ?
            "d-none" :
            "";
        return (
            `  <div class="card collapse_card mb-3 qr_page_component_card list-group-item ` +
            (QRPageComponents.isBulkUploadQRCode() &&
                empty(extractDataFromArray(component, ["card_enable"], 0)) ?
                "d-none" :
                "") +
            `"  data-type="` +
            component.component +
            `">
                        <div class="card-header d-flex justify-content-between" aria-expanded="true">
                            <h5 class="mb-0 d-flex align-item-center w-100">
                                ` +
            (QRPageComponents.isBulkUploadQRCode() ?
                "" :
                '<a class="btn handle display_on_hover py-2 pr-0 text-muted"><i class="icon-drag_1"></i></a>') +
            `
                                <a class="btn btn-link qr_page_component_card_title w-100 text-left">
                                    ` +
            extractDataFromArray(component_config, ["title"], "Info") +
            `
                                </a>
                            </h5>
                            <div class="qr_page_component_card_actions">
                            ` +
            (fixed_components.indexOf(component.component) < 0 ?
                `<a class="btn btn_delete_component_card display_on_hover ` +
                hide_action_buttons +
                `" ><i class="text-danger icon-delete_1"></i></a>` :
                "") +
            `
                                <a class="btn handle display_on_hover d-none"><i class="icon-drag_1"></i></a>
                                <div class="` +
            (QRPageComponents.isBulkUploadQRCode() ? "d-none" : "d-inline") +
            `  mr-2 ">` +
            QRPageComponentWrapper.getSwitcheryButton(
                "card_enable",
                extractDataFromArray(component, ["card_enable"], 1)
            ) +
            `</div> 
                                <a class="btn toggle_card_visiblitiy mr-0"><i class="icon-` +
            (hide ? "add_1" : "remove_1") +
            `"></i></a>
                            </div>
                        </div>
                        <div class="qr_page_component_card_body ` +
            (hide ? "" : "show") +
            ` secondary_color">
                            <div class="card-body">
                                <div class="row">
                                 ` +
            component_config.getInputWrapperHtml(component, index) +
            `
                                </div>
                            </div>` +
            (no_bg_components.indexOf(component.component) == -1 ?
                `
                            <div class="card-footer ` +
                (QRPageComponents.isBulkUploadQRCode() ? "d-none" : "d-flex") +
                ` ">
                                ` +
                QRPageComponentWrapper.getSwitcheryButton(
                    "card_bg_enable",
                    extractDataFromArray(component, ["card_background"], 1)
                ) +
                ` <div class="ml-2">Card Background</div>
                            </div>` :
                "") +
            `
                        </div>
                        
                    </div>
        `
        );
    },
    getTitleDescSectionData: function(parent) {
        return {
            title: $(parent)
                .find(".title_desc_wrapper_input input[name=title]")
                .val(),
            desc: $(parent).find(".title_desc_wrapper_input [name=desc]").val(),
            header_enable: $(parent).find("input[name=header_enable]").prop("checked") ?
                1 :
                0,
        };
    },
    components: {},
};

const QRPageStyleComponents = {
    style: {},
    saved_styles: [],
    _container: "#page-tab-style-design-content",
    style_selected: -1,
    styleComponentWrappers: {
        color: {
            title: "Colors",
            getInputHtml: function() {
                const bg_colors = [
                    ["#517AFA", "#C5FEFF", "#061244", "#76839B"],
                    ["#374793", "#C5FEFF", "#061244", "#76839B"],
                    ["#D51A47", "#FFB1DB", "#061244", "#76839B"],
                    ["#FF8F03", "#FFD5A1", "#432806", "#805F37"],
                    ["#805F37", "#CCFFAC", "#1C380A", "#485540"],
                    ["#469EA6", "#BAF9FF", "#0A2F33", "#647374"],
                    ["#194F92", "#C1DDFF", "#061244", "#76839B"],
                    ["#6474E5", "#CED4FF", "#061244", "#76839B"],
                    ["#F53163", "#FFEDE8", "#061244", "#76839B"],
                    ["#683B2B", "#FFE9A7", "#271109", "#676361"],
                    ["#F9D326", "#FFEEA2", "#3B3106", "#5C5A53"],
                    ["#57F1B1", "#DEFFC9", "#0C1D16", "#707B76"],
                    ["#A8BE72", "#F1FFD0", "#262F0E", "#6D6F69"],
                    ["#223CCF", "#C7D0FF", "#0A2F33", "#647374"],
                    ["#E61313", "#FFC9C9", "#2F0F0F", "#696262"],
                    ["#210972", "#D4C7FF", "#061244", "#76839B"],
                    ["#000000", "#C3C3C3", "#2F2F2F", "#747474"],
                    ["#41B853", "#C4FFCD", "#09270E", "#777E78"],
                    ["#D89D1A", "#FFEABC", "#261D0B", "#76726C"],
                    ["#E1EA35", "#FBFFB1", "#242604", "#72726D"],
                ];
                const text_colors = [
                    ["#333333", "#dddddd"],
                    ["#374793", "#C5FEFF"],
                    ["#D51A47", "#FFB1DB"],
                    ["#FF8F03", "#FFD5A1"],
                ];
                let bgColorsHtml = "";
                bg_colors.forEach((color) => {
                    let active = "";
                    if (
                        color[0] ==
                        extractDataFromArray(
                            QRPageStyleComponents, ["style", "primary_bg_color"],
                            bg_colors[0][0]
                        ) &&
                        color[1] ==
                        extractDataFromArray(
                            QRPageStyleComponents, ["style", "secondary_bg_color"],
                            bg_colors[0][1]
                        )
                    ) {
                        active = "active";
                    }
                    bgColorsHtml +=
                        `<li class="` +
                        active +
                        `">
                                        <div class="qr_color_panel_wr" data-bg_1="` +
                        color[0] +
                        `"  data-bg_2="` +
                        color[1] +
                        `" data-text_1="` +
                        color[2] +
                        `"  data-text_2="` +
                        color[3] +
                        `">
                                            <div class="qr_color_panel_1" style="background: ` +
                        color[0] +
                        `">
                                            </div>
                                            <div class="qr_color_panel_2" style="background: ` +
                        color[1] +
                        `">
                                            </div>
                                        </div>
                                    </li>`;
                });

                let textColorsHtml = "";
                // text_colors.forEach(color => {
                //     let active = '';
                //     if (color[0] == extractDataFromArray(QRPageStyleComponents, ['style', 'primary_text_color'], text_colors[0][0]) && color[1] == extractDataFromArray(QRPageStyleComponents, ['style', 'secondary_text_color'], text_colors[0][1])) {
                //         active = 'active';
                //     }
                //     textColorsHtml += `<li class="` + active + `">
                //                         <div class="qr_color_panel_wr">
                //                             <div class="qr_color_panel_1" style="background: `+ color[0] + `">
                //                             </div>
                //                             <div class="qr_color_panel_2" style="background: `+ color[1] + `">
                //                             </div>
                //                         </div>
                //                     </li>`
                // })
                return (
                    `<div class="col-md-12 d-none"><h6>Background Color</h6></div>
                        <div class="col-md-12">
                            <ul class="borderbox qr_color_panel_bg" data-type="bg">
                                ` +
                    bgColorsHtml +
                    `
                            </ul>
                        </div>
                       ` +
                    QRPageStyleComponents.getColorPickerHtml(
                        "Primary Color",
                        "colorpicker-bg-primary",
                        extractDataFromArray(
                            QRPageStyleComponents.style, ["primary_bg_color"],
                            bg_colors[0][0]
                        )
                    ) +
                    `
                      ` +
                    QRPageStyleComponents.getColorPickerHtml(
                        "Secondary Color",
                        "colorpicker-bg-secondary",
                        extractDataFromArray(
                            QRPageStyleComponents.style, ["secondary_bg_color"],
                            bg_colors[0][1]
                        )
                    ) +
                    `<div class="col-md-12 mt-3 d-none"><h6>Text Color</h6></div>
                      <div class="col-md-12 d-none">
                      <ul class="borderbox qr_color_panel_text"  data-type="text">
                          ` +
                    textColorsHtml +
                    `
                      </ul>
                  </div>
                 ` +
                    QRPageStyleComponents.getColorPickerHtml(
                        "Primary Profile Text Color",
                        "colorpicker-profile-primary",
                        extractDataFromArray(
                            QRPageStyleComponents.style, ["primary_profile_text_color"],
                            bg_colors[0][2]
                        )
                    ) +
                    `
                ` +
                    QRPageStyleComponents.getColorPickerHtml(
                        "Secondary Profile Text Color",
                        "colorpicker-profile-secondary",
                        extractDataFromArray(
                            QRPageStyleComponents.style, ["secondary_profile_text_color"],
                            bg_colors[0][3]
                        )
                    ) +
                    `
                 ` +
                    QRPageStyleComponents.getColorPickerHtml(
                        "Primary Text Color",
                        "colorpicker-text-primary",
                        extractDataFromArray(
                            QRPageStyleComponents.style, ["primary_text_color"],
                            bg_colors[0][2]
                        )
                    ) +
                    `
                ` +
                    QRPageStyleComponents.getColorPickerHtml(
                        "Secondary Text Color",
                        "colorpicker-text-secondary",
                        extractDataFromArray(
                            QRPageStyleComponents.style, ["secondary_text_color"],
                            bg_colors[0][3]
                        )
                    )
                );
            },
        },
        bg_img: {
            title: "Background Image",
            preset: [
                "/images/digitalCard/bg_page_1.jpg",
                "/images/digitalCard/student_background.jpg",
                "/images/digitalCard/youtuber_background.jpg",
                "/images/digitalCard/bg/event_ticket_background_1.jpg",
                "/images/digitalCard/bg/pet_tag_bg_1.jpg",
                "/images/digitalCard/bg/pet_tag_bg_2.jpg",
                "/images/digitalCard/bg/coupon_background_1.jpg",
                "/images/digitalCard/bg/coupon_background_2.jpg",
                "/images/digitalCard/bg/background_1.jpg",
                // '/images/digitalCard/bg_video/video_2.mp4',
                "/images/digitalCard/bg/background_2.jpg",
                "/images/digitalCard/bg_video/video_5.mp4",
                "/images/digitalCard/bg/background_3.jpg",
                "/images/digitalCard/bg/background_4.jpg",
                "/images/digitalCard/bg/background_5.jpg",
                "/assets/images/fb_cover.svg",
                "/images/digitalCard/bg_video/video_3.mp4",
                "/images/digitalCard/bg/background_6.jpg",
                "/images/digitalCard/bg/background_7.jpg",
                "/images/digitalCard/bg_video/video_7.mp4",
                "/images/digitalCard/bg/background_8.jpg",
                "/images/digitalCard/bg/background_9.jpg",
                "/images/digitalCard/bg_video/video_6.mp4",
                "/images/digitalCard/bg/background_10.jpg",
                "/images/digitalCard/bg/background_11.jpg",
                "/images/digitalCard/bg/background_12.jpg",
                "/images/digitalCard/bg/background_13.jpg",
                "/images/digitalCard/bg/background_14.jpg",
                "/images/digitalCard/bg/background_15.jpg",
                "/images/digitalCard/bg/background_16.jpg",
                "/images/digitalCard/bg/background_17.jpg",
                "/images/digitalCard/bg/background_18.jpg",
                "/images/digitalCard/bg/background_19.jpg",
                "/images/digitalCard/bg/background_20.jpg",
                "/images/digitalCard/bg/bg_image_5.jpg",
                "/images/digitalCard/bg/bg_image_4.jpg",
                // '/images/digitalCard/bg_video/video.mp4',
                // '/images/digitalCard/bg_video/video_1.mp4',
                // '/images/digitalCard/bg_video/video_4.mp4',
                "/images/digitalCard/bg_video/video_8.mp4",
                // '/images/digitalCard/bg_video/video_9.mp4',
                "/images/digitalCard/bg_video/video_10.mp4",
                // '/images/digitalCard/bg_video/video_11.mp4',
                "/images/defaultImages/medical-alerts/bg_medical_alert_1.png",
                "/images/defaultImages/medical-alerts/bg_medical_alert_2.png",
                "/images/defaultImages/medical-alerts/bg_medical_alert_3.png",
                "/images/defaultImages/medical-alerts/bg_medical_alert_4.png",
            ],
            getInputHtml: function() {
                let imageHtml = ``;
                let selectedImg = extractDataFromArray(
                    QRPageStyleComponents.style, ["bg_img"],
                    ""
                );
                if (selectedImg.includes("cdn03.qrcodechimp.com")) {
                    imageHtml +=
                        `<div class="img_uploaded_card selected user_upload_img mr-3" style="background-image:url('` +
                        selectedImg +
                        `'); position:relative;"></div>`;
                }

                QRPageStyleComponents.styleComponentWrappers.bg_img.preset.forEach(
                    (image) => {
                        let selected = "";
                        if (selectedImg.includes(image)) {
                            selected = "selected";
                        }
                        if (image.endsWith(".mp4")) {
                            imageHtml +=
                                `<div class="img_uploaded_card ` +
                                selected +
                                ` mr-3" style="background-image:url('` +
                                image.cleanReplace(".mp4", ".jpg") +
                                `'); position:relative;" data-video="` +
                                image +
                                `">
                                        <div class="video_icon">
                                            <i class="icon-play3"></i>
                                        </div>
                                    </div>`;
                        } else {
                            imageHtml +=
                                `<div class="img_uploaded_card ` +
                                selected +
                                ` mr-3" style="background-image:url('` +
                                wrapperUrlWithCdn(image) +
                                `'); position:relative;"></div>`;
                        }
                    }
                );
                // let userUploadHtml = '';

                return (
                    `<div class="col-md-12 px-3 mb-3">
                            <div class="mb-2">Image / Video</div>
                            <div class="d-flex img_upload_card_wrapper bg_img_upload_card_wrapper flex-wrap thinScrollBar pt-2">
                                <div class="img_uploaded_card remove_img mr-3" style="background-image:url('` +
                    wrapperUrlWithCdn("/assets/images/close.svg") +
                    `');"></div>
                                <div class="img_uploaded_card upload_bg_img mr-3 d-flex justify-content-center align-items-center">
                                    <i class="font-24 icon-file_upload_1"></i>
                                </div>
                                ` +
                    imageHtml +
                    `
                                <input class="d-none" type="file" name="pg_upload_bg_image" accept="image/*">
                            </div>
                        </div>
                    `
                );
            },
        },
        ld_img: {
            title: "Page Loader",
            getInputHtml: function() {
                return (
                    '<div class="pg_loader_wrp">' +
                    QRPageComponentWrapper.getImageUploader(
                        "Loader", [
                            extractDataFromArray(
                                QRPageStyleComponents.style, ["ld_img"],
                                extractDataFromArray(
                                    user_info, ["default_loader_img"],
                                    wrapperUrlWithCdn("/assets/images/def_qrc_loader.png")
                                )
                            ),
                        ],
                        "",
                        "1:1 Ratio"
                    ) +
                    "</div>"
                );
            },
        },
        page_setting: {
            title: "Page Settings",
            getInputHtml: function() {
                let share_qr_input_html = "";
                if (
                    page == "digital-business-card" ||
                    page == "digital-business-cards"
                ) {
                    share_qr_input_html +=
                        `<div class="col-md-12 mt-3 mb-2 d-flex">
                    <div class="mr-2 mb-2">Page QR Code </div>` +
                        QRPageComponentWrapper.getSwitcheryButton(
                            "style_page_qr_code",
                            extractDataFromArray(
                                QRPageComponents.page_setting, ["page_qr_code"],
                                1
                            )
                        ) +
                        `
                    <div class="ml-4 mr-2 mb-2">Page Sharing Option </div>` +
                        QRPageComponentWrapper.getSwitcheryButton(
                            "style_page_sharing",
                            extractDataFromArray(
                                QRPageComponents.page_setting, ["page_sharing"],
                                1
                            )
                        ) +
                        `
                </div>`;
                }
                return (
                    QRPageComponentWrapper.getInputText(
                        "Email me on scan",
                        "emails",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["email_on_scan", "emails"],
                            ""
                        ),
                        12,
                        "email_on_scan_enable",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["email_on_scan", "enable"],
                            1
                        ),
                        "Comma-separated emails."
                    ) + share_qr_input_html
                );
                // + QRPageComponentWrapper.getInputText("SMS me on scan", "subtitle", '', 12, 'sms_on_scan_enable', '')
            },
        },
        font_style: {
            title: "Font Style",
            fonts: {
                default: {
                    title: "Default",
                    img: "close.svg",
                    src: ``,
                    style: "'SF Pro Text','SF Pro Icons', 'Helvetica Neue','Helvetica','Arial',sans-serif",
                },
                work_sans: {
                    title: "Work Sans",
                    img: "fonts/work_sans.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;700&display=swap" rel="stylesheet">`,
                    style: "'Work Sans', sans-serif",
                },
                open_sans: {
                    title: "Open Sans",
                    img: "fonts/opensans.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&display=swap" rel="stylesheet">`,
                    style: "'Open Sans', sans-serif",
                },
                roboto: {
                    title: "Roboto",
                    img: "fonts/roboto.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">`,
                    style: "'Roboto', sans-serif",
                },
                playfair_display: {
                    title: "Playfair Display",
                    img: "fonts/playfair_display.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&display=swap" rel="stylesheet">`,
                    style: "'Playfair Display', serif",
                },
                josefin_sans: {
                    title: "Josefin Sans",
                    img: "fonts/josefin_sans.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;700&display=swap" rel="stylesheet">`,
                    style: "'Josefin Sans', sans-serif",
                },
                slabo: {
                    title: "Slabo",
                    img: "fonts/slabo.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Slabo+27px&display=swap" rel="stylesheet">`,
                    style: " 'Slabo 27px', serif",
                },
                concert_one: {
                    title: "Concert One",
                    img: "fonts/concert_one.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Concert+One&display=swap" rel="stylesheet">`,
                    style: "'Concert One', cursive",
                },
                krona_one: {
                    title: "Krona One",
                    img: "fonts/krona_one.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap" rel="stylesheet">`,
                    style: "'Krona One', sans-serif",
                },
                syne: {
                    title: "Syne",
                    img: "fonts/syne.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&display=swap" rel="stylesheet">`,
                    style: "'Syne', sans-serif",
                },
                federo: {
                    title: "Federo",
                    img: "fonts/federo.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Federo&display=swap" rel="stylesheet">`,
                    style: "'Federo', sans-serif",
                },
                viaoda_libre: {
                    title: "Viaoda Libre",
                    img: "fonts/viaoda_libre.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Viaoda+Libre&display=swap" rel="stylesheet">`,
                    style: "'Viaoda Libre', cursive",
                },
                handlee: {
                    title: "Handlee",
                    img: "fonts/handlee.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Handlee&display=swap" rel="stylesheet">`,
                    style: "'Handlee', cursive",
                },
                courier: {
                    title: "Courier New",
                    img: "fonts/courier.png",
                    src: ``,
                    style: "Courier New, sans-serif",
                },
                poppins: {
                    title: "Poppins",
                    img: "fonts/poppins.png",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">`,
                    style: "'Poppins', sans-serif",
                },
                gess2: {
                    custom_fonts: 1,
                    title: "GESSTwo",
                    img: "",
                    src: `<style>@font-face { font-family: 'GE SS Two'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/GESSTwoMedium-Medium.woff2"
                        ) +
                        `') format('woff2'), url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/GESSTwoMedium-Medium.woff"
                        ) +
                        ` format('woff'); font-weight: 500; font-style: normal; font-display: swap; }</style>`,
                    style: "GE SS Two",
                },
                messinaseriff: {
                    custom_fonts: 1,
                    title: "Messina Serif",
                    img: "",
                    src: `<style>@font-face { font-family: 'Messina Serif'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/MessinaSerif-Regular.woff2"
                        ) +
                        `') format('woff2'), url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/MessinaSerif-Regular.woff"
                        ) +
                        ` format('woff'); font-weight: 500; font-style: normal; font-display: swap; }</style>`,
                    style: "Messina Serif",
                },
                messinasans: {
                    custom_fonts: 1,
                    title: "Messina Sans",
                    img: "",
                    src: `<style>@font-face { font-family: 'Messina Sans'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/MessinaSans-Regular.woff2"
                        ) +
                        ` format('woff2'), url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/MessinaSans-Regular.woff"
                        ) +
                        ` format('woff'); font-weight: 500; font-style: normal; font-display: swap; }</style>`,
                    style: "Messina Sans",
                },
                montserrat: {
                    // custom_fonts : 1,
                    title: "Montserrat",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">`,
                    style: "'Montserrat', sans-serif",
                },
                lato: {
                    // custom_fonts : 1,
                    title: "Lato",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">`,
                    style: "'Lato', sans-serif",
                },
                spectral: {
                    // custom_fonts : 1,
                    title: "Spectral",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;700&display=swap" rel="stylesheet">`,
                    style: "'Spectral', serif",
                },
                manrope: {
                    // custom_fonts : 1,
                    title: "Manrope",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Manrope&display=swap" rel="stylesheet">`,
                    style: "'Manrope', sans-serif",
                },
                didot: {
                    // custom_fonts : 1,
                    title: "Didot",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=GFS+Didot&display=swap" rel="stylesheet">`,
                    style: "'GFS Didot', serif",
                },
                Kano: {
                    // custom_fonts : 1,
                    title: "Mukta",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap" rel="stylesheet">`,
                    style: "'Mukta', sans-serif",
                },
                kano: {
                    custom_fonts: 1,
                    title: "Kano",
                    img: "",
                    src: `<style>@font-face { font-family: 'Kano'; src: url('` +
                        wrapperUrlWithCdn("/assets/css/customFonts/Kano-regular.woff2") +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "Kano",
                },
                magenta: {
                    custom_fonts: 1,
                    title: "Magenta",
                    img: "",
                    src: `<style>@font-face { font-family: 'Magenta'; src: url('` +
                        wrapperUrlWithCdn("/assets/css/customFonts/Magenta.woff2") +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "Magenta",
                },
                minervamodern: {
                    custom_fonts: 1,
                    title: "MinervaModern",
                    img: "",
                    src: `<style>@font-face { font-family: 'MinervaModern'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/MinervaModern-Regular.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "MinervaModern",
                },
                gilroy: {
                    custom_fonts: 1,
                    title: "Gilroy",
                    img: "",
                    src: `<style>@font-face { font-family: 'Gilroy'; src: url('` +
                        wrapperUrlWithCdn("/assets/css/customFonts/Gilroy-Regular.woff2") +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "Gilroy",
                },
                mont: {
                    custom_fonts: 1,
                    title: "Mont",
                    img: "",
                    src: `<style>@font-face { font-family: 'Mont'; src: url('` +
                        wrapperUrlWithCdn("/assets/css/customFonts/Mont-Regular.woff2") +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "Mont",
                },
                marcellus: {
                    // custom_fonts : 1,
                    title: "Marcellus",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet">`,
                    style: "'Marcellus', serif",
                },
                Mulish: {
                    // custom_fonts : 1,
                    title: "Mulish",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Mulish:ital@0;1&display=swap" rel="stylesheet">`,
                    style: "'Mulish', sans-serif",
                },
                kurye: {
                    custom_fonts: 1,
                    title: "Kurye",
                    img: "",
                    src: `<style>@font-face { font-family: 'Kurye'; src: url('` +
                        wrapperUrlWithCdn("/assets/css/customFonts/kurye-light.woff2") +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "Kurye",
                },
                dm_serif: {
                    // custom_fonts : 1,
                    title: "DM Serif",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" rel="stylesheet">`,
                    style: "'DM Serif', serif",
                },
                dm_sans: {
                    // custom_fonts : 1,
                    title: "DM Sans",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=DM+Sans&display=swap" rel="stylesheet">`,
                    style: "'DM Sans', sans-serif",
                },
                be_vietnam_pro: {
                    title: "Be Vietnam Pro",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap" " rel="stylesheet">`,
                    style: "'Be Vietnam Pro', sans-serif",
                },
                dm_serif_display: {
                    title: "DM Serif Display",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" " rel="stylesheet">`,
                    style: "'DM Serif Display', serif",
                },
                Century751BT_ItalicB: {
                    custom_fonts: 1,
                    title: "Century751BT_ItalicB",
                    img: "",
                    src: `<style>@font-face { font-family: 'Century751BT_ItalicB'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/Century751BT_ItalicB.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "Century751BT_ItalicB",
                },
                Century751BT_RomanB: {
                    custom_fonts: 1,
                    title: "Century751BT_RomanB",
                    img: "",
                    src: `<style>@font-face { font-family: 'Century751BT_RomanB'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/Century751BT_RomanB.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "Century751BT_RomanB",
                },
                Century751BT_SemiBold: {
                    custom_fonts: 1,
                    title: "Century751BT_SemiBold",
                    img: "",
                    src: `<style>@font-face { font-family: 'Century751BT_SemiBold'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/Century751BT_SemiBold.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "Century751BT_SemiBold",
                },
                GillSansNova_Book: {
                    custom_fonts: 1,
                    title: "GillSansNova_Book",
                    img: "",
                    src: `<style>@font-face { font-family: 'GillSansNova_Book'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/GillSansNova_Book.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "GillSansNova_Book",
                },
                GillSansNova_BookItalic: {
                    custom_fonts: 1,
                    title: "GillSansNova_BookItalic",
                    img: "",
                    src: `<style>@font-face { font-family: 'GillSansNova_BookItalic'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/GillSansNova_BookItalic.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "GillSansNova_BookItalic",
                },
                GillSansNova_Light: {
                    custom_fonts: 1,
                    title: "GillSansNova_Light",
                    img: "",
                    src: `<style>@font-face { font-family: 'GillSansNova_Light'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/GillSansNova_Light.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "GillSansNova_Light",
                },
                GillSansNova_LightItalic: {
                    custom_fonts: 1,
                    title: "GillSansNova_LightItalic",
                    img: "",
                    src: `<style>@font-face { font-family: 'GillSansNova_LightItalic'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/GillSansNova_LightItalic.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "GillSansNova_LightItalic",
                },
                GillSansNova_Medium: {
                    custom_fonts: 1,
                    title: "GillSansNova_Medium",
                    img: "",
                    src: `<style>@font-face { font-family: 'GillSansNova_Medium'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/GillSansNova_Medium.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "GillSansNova_Medium",
                },
                GillSansNova_SemiBold: {
                    custom_fonts: 1,
                    title: "GillSansNova_SemiBold",
                    img: "",
                    src: `<style>@font-face { font-family: 'GillSansNova_SemiBold'; src: url('` +
                        wrapperUrlWithCdn(
                            "/assets/css/customFonts/GillSansNova_SemiBold.woff2"
                        ) +
                        ` format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }</style>`,
                    style: "GillSansNova_SemiBold",
                },
                prompt_f: {
                    custom_fonts: 1,
                    title: "Prompt",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&display=swap" rel="stylesheet">`,
                    style: "'Prompt', sans-serif",
                },
                sarabun: {
                    custom_fonts: 1,
                    title: "Sarabun",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">`,
                    style: "'Sarabun', sans-serif",
                },
                anuphan: {
                    custom_fonts: 1,
                    title: "Anuphan",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600;700&display=swap" rel="stylesheet">`,
                    style: "'Anuphan', sans-serif",
                },
                trirong: {
                    custom_fonts: 1,
                    title: "Trirong",
                    img: "",
                    src: `<link href="https://fonts.googleapis.com/css2?family=Trirong:wght@400;600;700&display=swap" rel="stylesheet">`,
                    style: "'Trirong', serif",
                },
            },
            getInputHtml: function() {
                function getFontStylesHtml() {
                    let fontItemHtmls = "";
                    Object.keys(
                        QRPageStyleComponents.styleComponentWrappers.font_style.fonts
                    ).forEach((font) => {
                        if (
                            extractDataFromArray(
                                QRPageStyleComponents.styleComponentWrappers.font_style.fonts, [font, "custom_fonts"],
                                0
                            )
                        ) {
                            let user_custom_font_list = extractDataFromArray(
                                user_info, ["custom_options", "include_custom_fonts"], []
                            );
                            if (empty(user_custom_font_list)) {
                                return "";
                            } else if (user_custom_font_list.indexOf(font) == -1) {
                                return "";
                            }
                        }
                        let active = "";
                        if (
                            extractDataFromArray(
                                QRPageStyleComponents.style, ["font"],
                                "default"
                            ) == font
                        ) {
                            active = "selected";
                        }
                        let img = extractDataFromArray(
                            QRPageStyleComponents.styleComponentWrappers.font_style.fonts, [font, "img"],
                            ""
                        );
                        let thumbnailHtml = "";
                        if (empty(img)) {
                            thumbnailHtml = `<div style=" width: 36px; font-size: 24px; " class="">Aa</div>`;
                        } else {
                            thumbnailHtml =
                                `<img src="` +
                                wrapperUrlWithCdn(
                                    `/assets/images/` +
                                    QRPageStyleComponents.styleComponentWrappers.font_style
                                    .fonts[font].img
                                ) +
                                `" width="36" height="36" class="">`;
                        }
                        fontItemHtmls +=
                            `<div class="font_style_item">
                                            <div class="font_style_card ` +
                            active +
                            `" data-type="` +
                            font +
                            `">
                                                ` +
                            thumbnailHtml +
                            `
                                            </div>
                                            <div class="text-center mt-1 font-12">` +
                            QRPageStyleComponents.styleComponentWrappers.font_style.fonts[
                                font
                            ].title +
                            `</div>
                                        </div>`;
                    });

                    return (
                        `<div class="col-md-12 d-flex font_style_card_wrapper flex-wrap">` +
                        fontItemHtmls +
                        `</div>`
                    );
                }
                return (
                    `<div class="col-md-12 mb-2">
                            <div class="mr-2 mb-2">Font </div>
                        </div>` + getFontStylesHtml()
                );
            },
        },
        card_style: {
            title: "Card Style",
            getInputHtml: function() {
                let card_style = extractDataFromArray(
                    QRPageStyleComponents.style, ["card"], {}
                );

                function getDropShadowParams() {
                    return (
                        `<div class="col-md-6 d-flex">
                                <div class="mr-2">
                                    <label>X</label>
                                    <input type="number" min="0" id="card_shadow_x" max="100" value="` +
                        extractDataFromArray(card_style, ["x"], 0) +
                        `" class="form-control" style="width:60px">
                                </div>
                                <div class="mr-2">
                                    <label>Y</label>
                                    <input type="number" min="0" id="card_shadow_y" max="100" value="` +
                        extractDataFromArray(card_style, ["y"], 7) +
                        `" class="form-control" style="width:60px">
                                </div>
                                <div class="mr-2">
                                    <label>Blur</label>
                                    <input type="number" min="0" id="card_shadow_blur" max="100" value="` +
                        extractDataFromArray(card_style, ["blur"], 29) +
                        `" class="form-control" style="width:60px">
                                </div>
                                <div class="mr-2">
                                    <label>Spread</label>
                                    <input type="number" min="0" id="card_shadow_spread" max="100" value="` +
                        extractDataFromArray(card_style, ["spread"], 0) +
                        `" class="form-control" style="width:60px">
                                </div>
                            </div>`
                    );
                }

                function getBorderRadiusSlider() {
                    return (
                        `<div class="col-md-6">
                            <label>Corners</label>
                            <div class="d-block">
                                <input type="range" min="0" max="100" value="` +
                        extractDataFromArray(card_style, ["border_radius"], 16) +
                        `" class="slider sliderInput" id="card_border_radius"  style="width:100%; ">
                            </div>
                        </div>`
                    );
                }
                return (
                    `<div class="col-md-12 mb-2 d-flex">
                            <div class="mr-2 mb-2">Card Background </div>` +
                    QRPageComponentWrapper.getSwitcheryButton(
                        "style_card_enable",
                        extractDataFromArray(card_style, ["enable"], 1)
                    ) +
                    `
                        </div>` +
                    QRPageStyleComponents.getColorPickerHtml(
                        "Background color",
                        "colorpicker-card-bg",
                        extractDataFromArray(card_style, ["bg_color"], "#ffffff")
                    ) +
                    getBorderRadiusSlider() +
                    QRPageStyleComponents.getColorPickerHtml(
                        "Drop shadow",
                        "colorpicker-card-shadow",
                        extractDataFromArray(card_style, ["shadow_color"], "#64646f33")
                    ) +
                    getDropShadowParams()
                );
            },
        },
        saved_style: {
            title: "Saved Style",
            getInputHtml: function() {
                let styleCards = "";
                if (empty(QRPageStyleComponents.saved_styles)) {
                    styleCards = '<div class="mr-2 mb-2">No style saved</div>';
                } else {
                    QRPageStyleComponents.saved_styles.forEach((style, index) => {
                        styleCards += QRPageStyleComponents.getSavedStyleWrapper(
                            index,
                            style
                        );
                    });
                }
                return (
                    `<div class="col-md-12 mb-2 d-flex row" id="saved_style_container">` +
                    styleCards +
                    `</div>`
                );
            },
        },
        custom_css: {
            title: "Custom CSS",
            getInputHtml: function() {
                return QRPageComponentWrapper.getTextAreaInput(
                    "Custom CSS",
                    "custom_css",
                    extractDataFromArray(
                        QRPageStyleComponents.style, ["custom_css_user"],
                        ""
                    ),
                    12
                );
            },
        },
        passcode: {
            title: "Passcode Protection",
            enable_option: 1,
            getInputHtml: function() {
                QRPageComponents.page_setting = extractDataFromArray(
                    __savedQrCodeParams, ["page_setting"],
                    QRPageComponents.page_setting
                );
                return (
                    `<div class="col-md-12" >
                            <div class='d-flex justify-content-center' style="padding-bottom:12px" >
                                <img src='/images/pass_code_img.png' style="max-width:154px" />
                            </div>
                            <div class="row p-2 mx-0 mt-2" style="background: var(--light-color);">` +
                    QRPageComponentWrapper.getInputText(
                        "Enter the passcode*",
                        "passcode",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["passcode", "passcode"],
                            ""
                        ),
                        6,
                        "",
                        false,
                        "",
                        "text",
                        "showErrorPasscode"
                    ) +
                    QRPageComponentWrapper.getInputText(
                        "Session Timeout (in Minutes)*",
                        "timeout",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["passcode", "timeout"],
                            480
                        ),
                        6,
                        "",
                        false,
                        "",
                        "number",
                        "showErrorTimeout"
                    ) +
                    `
                            </div>
                        </div>` +
                    '<div class="col-md-12 mt-4 mb-3 font-weight-semibold">Display for Prompt</div>' +
                    QRPageComponentWrapper.getInputText(
                        "Heading",
                        "title",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["passcode", "title"],
                            "Passcode Protected Page"
                        )
                    ) +
                    QRPageComponentWrapper.getTextAreaInput(
                        "Description",
                        "desc",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["passcode", "desc"],
                            "The access to this page is protected by a passcode. Please enter the passcode to proceed."
                        )
                    ) +
                    QRPageComponentWrapper.getInputText(
                        "Passcode Input Label",
                        "input_label",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["passcode", "input_label"],
                            "Enter Passcode"
                        ),
                        6,
                        "",
                        false,
                        "",
                        "text"
                    ) +
                    QRPageComponentWrapper.getInputText(
                        "Button Label",
                        "btn_label",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["passcode", "btn_label"],
                            "Proceed"
                        ),
                        6,
                        "",
                        false,
                        "",
                        "text"
                    )
                );
            },
        },
        privacyAlert: {
            title: "Privacy Popup",
            enable_option: 1,
            default_enable: 1,
            getInputHtml: function() {
                return (
                    QRPageComponentWrapper.getInputText(
                        "Heading",
                        "title",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["privacyAlert", "title"],
                            "Privacy Warning"
                        ),
                        12,
                        "",
                        false,
                        "",
                        "text"
                    ) +
                    QRPageComponentWrapper.getTextAreaInput(
                        "Description",
                        "desc",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["privacyAlert", "desc"],
                            "By continuing, you agree to have access authorization or permission from the owner of this page."
                        )
                    ) +
                    QRPageComponentWrapper.getInputText(
                        "Confirm Button Label",
                        "confirm_btn_label",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["privacyAlert", "confirm_btn_label"],
                            "Continue"
                        ),
                        12,
                        "",
                        false,
                        "",
                        "text"
                    ) +
                    `<div class="col-md-12" ><span>Clicking on confirm button will close this privacy popup and show the page.</span></div>
                <div class="col-md-12 mt-4 mb-1 font-weight-semibold">Secondary Button ` +
                    QRPageComponentWrapper.getSwitcheryButton(
                        "sec_btn_enable",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["privacyAlert", "sec_btn_enable"],
                            0
                        )
                    ) +
                    `</div>
                <div class="col-md-12" >
                            <div class="row p-2 mx-0 mt-2 mb-4" style="background: var(--light-color);">` +
                    QRPageComponentWrapper.getInputText(
                        "Button Label",
                        "sec_btn_label",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["privacyAlert", "sec_btn_label"],
                            "Exit"
                        ),
                        12,
                        "",
                        false,
                        "",
                        "text"
                    ) +
                    QRPageComponentWrapper.getInputText(
                        "Button Link",
                        "sec_btn_link",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["privacyAlert", "sec_btn_link"],
                            "https://www.qrcodechimp.com"
                        ),
                        12,
                        "",
                        false,
                        "",
                        "text"
                    ) +
                    `
                            </div>
                        </div>` +
                    QRPageComponentWrapper.getInputText(
                        "Footer Disclaimer",
                        "footer_text",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["privacyAlert", "footer_text"],
                            "By continuing, you agree to the Terms of Service and Privacy Policy."
                        )
                    ) +
                    QRPageComponentWrapper.getInputText(
                        "Footer Disclaimer Link",
                        "footer_link",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["privacyAlert", "footer_link"],
                            "https://www.qrcodechimp.com"
                        )
                    )
                );
            },
        },

        lock_code: {
            title: "Lock QR Code",
            enable_option: 1,
            getInputHtml: function() {
                QRPageComponents.page_setting = extractDataFromArray(
                    __savedQrCodeParams, ["page_setting"],
                    QRPageComponents.page_setting
                );
                return (
                    '<div class="col-md-12" ><div class="row p-2 mx-0 mt-2" style="background: var(--light-color);">' +
                    QRPageComponentWrapper.getInputText(
                        "After Scan",
                        "scan_count",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["lock_code", "scan_count"],
                            1
                        ),
                        6,
                        "",
                        false,
                        "",
                        "number",
                        "showErrorScan"
                    ) +
                    "</div></div>" +
                    `<div class="col-md-12 mt-3"><div class="mr-2 mb-2 d-inline">Lock only when scanned from owner/sub-account account</div>` +
                    QRPageComponentWrapper.getSwitcheryButton(
                        "lock_by_owner",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["lock_code", "lock_by_owner"],
                            1
                        )
                    ) +
                    "</div>" +
                    '<div class="col-md-12 mt-4 mb-3 font-weight-semibold">Display on Lock</div>' +
                    QRPageComponentWrapper.getInputText(
                        "Heading",
                        "title",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["lock_code", "title"],
                            "Heading"
                        )
                    ) +
                    QRPageComponentWrapper.getInputText(
                        "Description",
                        "desc",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["lock_code", "desc"],
                            "Description"
                        )
                    ) +
                    QRPageComponentWrapper.getImageUploader(
                        "Lock Image", [
                            extractDataFromArray(
                                QRPageComponents.page_setting, ["lock_code", "lock_img"],
                                "/images/lock_image.svg"
                            ),
                        ],
                        "250x250px, 1:1 Ratio",
                        "",
                        1,
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["lock_code", "lock_img_enable"],
                            1
                        ),
                        12,
                        "pr_img"
                    ) + `<div class="col-md-12 mt-3"><div class="mr-2 mb-2 d-inline">Show event ticket in background after lock</div>` +
                    QRPageComponentWrapper.getSwitcheryButton(
                        "show_after_lock",
                        extractDataFromArray(
                            QRPageComponents.page_setting, ["lock_code", "show_after_lock"],
                            1
                        )
                    )
                );
            },
        },
    },
    cards_open: {
        bg_img: 1
    },
    getStyleContainerComponents: function(addListener = true) {
        $(QRPageStyleComponents._container).html("");
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("bg_img")
        );
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("color")
        );
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("font_style")
        );
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("card_style")
        );
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("ld_img")
        );
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("page_setting")
        );
        // if (page == 'pet-id-tags' || page == 'digital-business-card' || page == 'digital-business-cards') {
        // }
        if (
            getUrlParameterByName("bulk") != 1 &&
            (page == "digital-business-card" || page == "digital-business-cards")
        ) {
            let hide = $(".url_slug_wrapper input").attr("readonly");
            hide = hide == undefined ? 1 : 0;
            $(QRPageStyleComponents._container).append(
                `
            <div class="card collapse_card mb-3 qr_page_component_card list-group-item" data-type="wallet_settings" ` +
                (hide ? 'style="display:none;"' : "") +
                `>
                <div class="card-header d-flex justify-content-between" aria-expanded="true">
                    <h5 class="mb-0">
                        <a class="btn btn-link qr_page_component_card_title">
                            Apple/Google Wallet Settings
                        </a>
                    </h5>
                </div>
            </div>`
            );
        }
        if (page == "event-ticket") {
            $(QRPageStyleComponents._container).append(
                QRPageStyleComponents.getStyleComponentWrapperHtml("lock_code")
            );
        }
        if (page == "medical-alert") {
            $(QRPageStyleComponents._container).append(
                QRPageStyleComponents.getStyleComponentWrapperHtml("privacyAlert")
            );
        }
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("passcode")
        );
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getSaveStyleButton()
        );
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("saved_style")
        );
        $(QRPageStyleComponents._container).append(
            QRPageStyleComponents.getStyleComponentWrapperHtml("custom_css")
        );

        QRPageStyleComponents.listeners(addListener);
        QRPageComponents.prepareHtml();
    },
    syncAllCardDisplayStates: function() {
        QRPageStyleComponents.cards_open = {};
        Array.from(
            $("#page-tab-style-design-content .qr_page_component_card")
        ).forEach((ele, index) => {
            QRPageStyleComponents.cards_open[$(ele).data("type")] = $(ele)
                .find(".qr_page_component_card_body")
                .hasClass("show") ?
                1 :
                0;
        });
    },
    listeners: function(addListener) {
        let colorpickerElements = [
            "bg-primary",
            "bg-secondary",
            "text-primary",
            "text-secondary",
            "card-bg",
            "card-shadow",
            "profile-primary",
            "profile-secondary",
        ];
        colorpickerElements.forEach((ele) => {
            $(".colorpicker-" + ele).spectrum({
                preferredFormat: "hex8",
                showAlpha: true,
            });
            $(".colorpicker-" + ele).on("keyup change", function(e) {
                ColorPicker.changeIconColor(e.target.value, $(this));
                $(".colorpicker-" + ele + "-input").val(e.target.value);
                $(".colorpicker-" + ele).val(e.target.value);
                $(".colorpicker-" + ele).spectrum({
                    preferredFormat: "hex8",
                    showAlpha: true,
                });
                QRPageStyleComponents.handleStyleInputChange();
            });
            $(".colorpicker-" + ele + "-input").on("input", function(e) {
                ColorPicker.changeIconColor(e.target.value, $(this));
                $(".colorpicker-" + ele + "-input").val(e.target.value);
                $(".colorpicker-" + ele).val(e.target.value);
                $(".colorpicker-" + ele).spectrum({
                    preferredFormat: "hex8",
                    showAlpha: true,
                });
                QRPageStyleComponents.handleStyleInputChange();
            });
        });

        if (!addListener) {
            return;
        }
        QRPageStyleComponents.fetchStyles();

        $(document).on(
            "click",
            ".qr_color_panel_bg li, .qr_color_panel_text li",
            function(e) {
                $(this).parent().find("li").removeClass("active");
                $(this).addClass("active");
                // var color1 = ColorPicker.rgbToHex($(this).find(".qr_color_panel_wr").data('bg_1'))
                // var color2 = ColorPicker.rgbToHex($(this).find(".qr_color_panel_wr").data('bg_2'))
                // var color3 = ColorPicker.rgbToHex($(this).find(".qr_color_panel_wr").data('text_1'))
                // var color4 = ColorPicker.rgbToHex($(this).find(".qr_color_panel_wr").data('text_2'))
                var color1 = $(this).find(".qr_color_panel_wr").data("bg_1");
                var color2 = $(this).find(".qr_color_panel_wr").data("bg_2");
                var color3 = $(this).find(".qr_color_panel_wr").data("text_1");
                var color4 = $(this).find(".qr_color_panel_wr").data("text_2");
                // var color4 = ColorPicker.rgbToHex($(this).children().children()[1].style['backgroundColor'])
                let type = $(this).parent().data("type");

                ColorPicker.changeIconColor(color1, $(".colorpicker-bg-primary"));
                ColorPicker.changeIconColor(color2, $(".colorpicker-bg-secondary"));
                ColorPicker.changeIconColor(color3, $(".colorpicker-text-primary"));
                ColorPicker.changeIconColor(color4, $(".colorpicker-text-secondary"));
                ColorPicker.changeIconColor(color3, $(".colorpicker-profile-primary"));
                ColorPicker.changeIconColor(
                    color4,
                    $(".colorpicker-profile-secondary")
                );

                $(".colorpicker-bg-primary-input").val(color1);
                $(".colorpicker-bg-primary").val(color1);
                $(".colorpicker-bg-primary").spectrum({
                    preferredFormat: "hex8",
                    showAlpha: true,
                });

                $(".colorpicker-bg-secondary-input").val(color2);
                $(".colorpicker-bg-secondary").val(color2);
                $(".colorpicker-bg-secondary").spectrum({
                    preferredFormat: "hex8",
                    showAlpha: true,
                });

                $(".colorpicker-text-primary-input").val(color3);
                $(".colorpicker-text-primary").val(color3);
                $(".colorpicker-text-primary").spectrum({
                    preferredFormat: "hex8",
                    showAlpha: true,
                });

                $(".colorpicker-text-secondary-input").val(color4);
                $(".colorpicker-text-secondary").val(color4);
                $(".colorpicker-text-secondary").spectrum({
                    preferredFormat: "hex8",
                    showAlpha: true,
                });

                $(".colorpicker-profile-primary-input").val(color3);
                $(".colorpicker-profile-primary").val(color3);
                $(".colorpicker-profile-primary").spectrum({
                    preferredFormat: "hex8",
                    showAlpha: true,
                });

                $(".colorpicker-profile-secondary-input").val(color4);
                $(".colorpicker-profile-secondary").val(color4);
                $(".colorpicker-profile-secondary").spectrum({
                    preferredFormat: "hex8",
                    showAlpha: true,
                });

                QRPageStyleComponents.handleStyleInputChange();
            }
        );

        $(document).on("input", ".custom_css_input_wrapper textarea", function(e) {
            QRPageStyleComponents.handleStyleInputChange();
        });

        $(document).on(
            "click",
            "#page-tab-style-design-content .font_style_card",
            function(e) {
                $(this)
                    .parents(".font_style_card_wrapper")
                    .find(".font_style_card")
                    .removeClass("selected");
                $(this).addClass("selected");
                QRPageStyleComponents.style.font = $(this).data("type");
                QRPageStyleComponents.handleStyleInputChange();
            }
        );

        $(document).on(
            "click",
            "#page-tab-style-design-content .img_uploaded_card.upload_bg_img",
            function(e) {
                if (!amILoggedIn()) {
                    e.stopPropagation();
                    $("#signup-free").modal("show");
                    __signup_callback = false;
                    return;
                }

                let parent = $(this).parents(".bg_img_upload_card_wrapper");
                FileManager.showFileManager("IMAGE", 1, (file) => {
                    let url = extractDataFromArray(file, [0, "asset_url"], "");
                    if (parent.find(".user_upload_img").length == 0) {
                        let div = document.createElement("div");
                        div.className = "img_uploaded_card selected user_upload_img mr-3";
                        div.style.backgroundImage = `url('` + url + `')`;
                        div.style.position = `relative`;
                        $(div).insertAfter(parent.find(".img_uploaded_card.upload_bg_img"));
                    }
                    parent.find(".img_uploaded_card").removeClass("selected");
                    parent.find(".user_upload_img").addClass("selected");
                    parent.find(".user_upload_img").css("background-image", "");
                    parent
                        .find(".user_upload_img")
                        .css("background-image", "url(" + url + ")");
                    QRPageStyleComponents.style.bg_img = url;
                    QRPageStyleComponents.handleStyleInputChange(e);
                });
            }
        );

        $(document).on(
            "click",
            "#page-tab-style-design-content .bg_img_upload_card_wrapper .img_uploaded_card",
            function(e) {
                if ($(this).hasClass("upload_bg_img")) {
                    return;
                }
                $(this)
                    .parents(".bg_img_upload_card_wrapper")
                    .find(".img_uploaded_card")
                    .removeClass("selected");

                if ($(this).hasClass("remove_img")) {
                    QRPageStyleComponents.style.bg_img = "";
                    QRPageStyleComponents.handleStyleInputChange(e);
                    return;
                }
                $(this).addClass("selected");

                let video = $(this)
                    .parents(".bg_img_upload_card_wrapper")
                    .find(".img_uploaded_card.selected")
                    .data("video");

                if (empty(video)) {
                    let icon_img = $(this)
                        .parents(".bg_img_upload_card_wrapper")
                        .find(".img_uploaded_card.selected")
                        .css("background-image");
                    if (!empty(icon_img)) {
                        icon_img = icon_img.split('"')[1];
                    }
                    QRPageStyleComponents.style.bg_img = icon_img;
                } else {
                    QRPageStyleComponents.style.bg_img = video;
                }
                QRPageStyleComponents.handleStyleInputChange(e);
            }
        );

        $(document).on("click", "#btn_save_style", function(e) {
            if (QRPageStyleComponents.style_selected != -1) {}
            QRPageStyleComponents.editStyleName();
        });

        $(document).on("click", ".saved_style_card", function(e) {
            let index = $(this).parents(".saved_style_wrapper").index();
            QRPageStyleComponents.syncAllCardDisplayStates();
            QRPageStyleComponents.style_selected = index;
            let custom_css = extractDataFromArray(
                QRPageStyleComponents.style, ["custom_css"],
                ""
            );
            QRPageStyleComponents.style = JSON.parse(
                JSON.stringify(
                    extractDataFromArray(
                        QRPageStyleComponents.saved_styles, [index, "style_config"], {}
                    )
                )
            );
            QRPageStyleComponents.style.custom_css = custom_css;
            QRPageStyleComponents.getStyleContainerComponents(false);
        });

        $(document).on("click", ".delete_style", function(e) {
            e.preventDefault();
            let style_id = $(this).parents(".saved_style_wrapper").data("style_id");
            QRPageStyleComponents.deleteStyle(style_id);
        });
    },
    getSaveStyleButton: function() {
        return `<button class="btn btn-outline-primary mb-3" id="btn_save_style">Save this Style</button>`;
    },
    getSavedStyleWrapper: function(index, style) {
        let bg_img = extractDataFromArray(style, ["style_config", "bg_img"], "");
        if (bg_img.endsWith(".mp4")) {
            bg_img = bg_img.cleanReplace(".mp4", ".jpg");
        }
        return (
            `<div class="saved_style_wrapper col-md-4" data-index="` +
            index +
            `" data-style_id="` +
            style._id +
            `">
                                                <div class="saved_style_action dropdown mr-2">
                                                    <a href="#" class="btn secondary_color dropdown-toggle" type="button" id="qrlist_more_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-moreoption"></i></a>
                                                    <div class="dropdown-menu dropdown-menu-right dropdown-shared-menu" aria-labelledby="qrlist_more_dropdown">
                                                        <a href="" class="btn btn-link dropdown-item remove_style d-none" >Remove Style</a>
                                                        <a href="" class="btn btn-link dropdown-item delete_style" >Delete Style</a>
                                                    </div>
                                                </div>
                                                <div class="saved_style_card ` +
            (QRPageStyleComponents.style_selected == index ? "selected" : "") +
            `">
                                                    <div class="saved_style_color" >
                                                        <div class="qr_color_panel_1" style="background: ` +
            extractDataFromArray(style, ["style_config", "primary_bg_color"], "") +
            `">
                                                        </div>
                                                        <div class="qr_color_panel_2" style="background: ` +
            extractDataFromArray(style, ["style_config", "secondary_bg_color"], "") +
            `">
                                                        </div>
                                                    </div>
                                                    <div class="saved_style_bg" style="background-image: url('` +
            bg_img +
            `');"></div>
                                                    <div class="saved_style_font saved_style_bg" style="background-image: url('` +
            wrapperUrlWithCdn(
                `/assets/images/` +
                extractDataFromArray(
                    QRPageStyleComponents.styleComponentWrappers.font_style.fonts, [
                        extractDataFromArray(style, ["style_config", "font"], "default"),
                        "img",
                    ],
                    ""
                )
            ) +
            `');"></div>
                                                </div>
                                                ` +
            extractDataFromArray(style, ["style_name"], "") +
            `</div>`
        );
    },
    getStyleComponentWrapperHtml: function(type) {
        let card_enable = extractDataFromArray(
            QRPageStyleComponents.styleComponentWrappers, [type, "enable_option"],
            0
        );
        QRPageComponents.page_setting = extractDataFromArray(
            __savedQrCodeParams, ["page_setting"],
            QRPageComponents.page_setting
        );
        return (
            `<div class="card collapse_card mb-3 qr_page_component_card list-group-item" data-type="` +
            type +
            `">
                    <div class="card-header d-flex justify-content-between" aria-expanded="true">
                        <h5 class="mb-0">
                            <a class="btn btn-link qr_page_component_card_title">
                                ` +
            QRPageStyleComponents.styleComponentWrappers[type].title +
            `
                            </a>
                        </h5>
                        <div class="qr_page_component_card_actions">
                         ` +
            (card_enable ?
                '<div class="mr-2">' +
                QRPageComponentWrapper.getSwitcheryButton(
                    "enable_" + type,
                    extractDataFromArray(
                        QRPageComponents.page_setting, [type, "enable_" + type],
                        extractDataFromArray(
                            QRPageStyleComponents.styleComponentWrappers[type], ["default_enable"],
                            0
                        )
                    )
                ) +
                "</div>" :
                "") +
            `
                            <a class="btn toggle_card_visiblitiy"><i class="` +
            (extractDataFromArray(QRPageStyleComponents.cards_open, [type], 0) ?
                "icon-remove_1" :
                "icon-add_1") +
            `"></i></a>
                        </div>
                    </div>
                    <div class="qr_page_component_card_body ` +
            (extractDataFromArray(QRPageStyleComponents.cards_open, [type], 0) ?
                "show" :
                "") +
            ` secondary_color ` +
            type +
            `_input_wrapper">
                        <div class="card-body">
                            <div class="row">
                                ` +
            QRPageStyleComponents.styleComponentWrappers[type]["getInputHtml"]() +
            `
                            </div>
                        </div>
                    </div>
                </div>`
        );
    },
    getColorPickerHtml: function(title, name, color) {
        return (
            ` <div class="col-md-6 mb-4">
                    <label>` +
            title +
            `</label>
                    <div class="input-group">
                        <input type="text" class="form-control ` +
            name +
            `" data-cancel-text="Cancel" data-choose-text="Choose" value="` +
            color +
            `" data-fouc>
                        <div class="color_picker_icon"><i class="icon-colorpicker"></i></div>
                        <input type="text" class="form-control border-left-0 ` +
            name +
            `-input qr_color_picker" placeholder="` +
            color +
            `" value="` +
            color +
            `">
                    </div>
                </div>`
        );
    },
    handleStyleInputChange: function(e) {
        if (__KEYUP_DELAY == undefined) __KEYUP_DELAY = 1000;
        if (_timeoutId != null) clearTimeout(_timeoutId);
        _timeoutId = setTimeout(function() {
            if (!QRPageComponents.isBulkUploadQRCode()) {
                QRPageStyleComponents.style.primary_bg_color = $(
                    ".colorpicker-bg-primary-input"
                ).val();
                QRPageStyleComponents.style.secondary_bg_color = $(
                    ".colorpicker-bg-secondary-input"
                ).val();
                QRPageStyleComponents.style.primary_text_color = $(
                    ".colorpicker-text-primary-input"
                ).val();
                QRPageStyleComponents.style.secondary_text_color = $(
                    ".colorpicker-text-secondary-input"
                ).val();
                QRPageStyleComponents.style.primary_profile_text_color = $(
                    ".colorpicker-profile-primary-input"
                ).val();
                QRPageStyleComponents.style.secondary_profile_text_color = $(
                    ".colorpicker-profile-secondary-input"
                ).val();
                QRPageStyleComponents.style.custom_css = extractDataFromArray(
                    getComponentStyleFromTemplate(QRPageComponents.selected_template), ["custom_css"],
                    ""
                );
                QRPageStyleComponents.style.custom_css_user = $(
                    ".custom_css_input_wrapper textarea"
                ).val();
                QRPageStyleComponents.style.custom_css_user =
                    QRPageStyleComponents.style.custom_css_user.replace(/<script>/g, "");
                QRPageStyleComponents.style.custom_css_user =
                    QRPageStyleComponents.style.custom_css_user.replace(
                        /<\/script>/g,
                        ""
                    );
                QRPageStyleComponents.style.card = {
                    enable: $("input[name=style_card_enable]").prop("checked") ? 1 : 0,
                    bg_color: $(".colorpicker-card-bg-input").val(),
                    shadow_color: $(".colorpicker-card-shadow-input").val(),
                    border_radius: $("#card_border_radius").val(),
                    x: $("#card_shadow_x").val(),
                    y: $("#card_shadow_y").val(),
                    blur: $("#card_shadow_blur").val(),
                    spread: $("#card_shadow_spread").val(),
                };
                if (typeof QRPageStyleComponents.style.ld_img == "undefined") {
                    QRPageStyleComponents.style.ld_img = extractDataFromArray(
                        user_info, ["default_loader_img"],
                        wrapperUrlWithCdn("/assets/images/def_qrc_loader.png")
                    );
                }
            }
            QRPageComponents.prepareHtml();
        }, __KEYUP_DELAY);
    },
    editStyleName: function(action = "A", name = "") {
        Swal.fire({
            title: "Save Style",
            html: `<div class="form-group mt-2 text-left">
                        <label>Style Name</label>
                        <input type="text" class="form-control mt-0"  value="` +
                extractDataFromArray(
                    QRPageStyleComponents.saved_styles, [QRPageStyleComponents.style_selected, "style_name"],
                    ""
                ) +
                `" id="style_name_input" required>
                    </div>`,
            reverseButtons: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            preConfirm: () => {
                const style_name = $("#style_name_input").val().trim();
                if (empty(style_name)) {
                    Swal.showValidationMessage("Style name cannot be empty.");
                    return;
                }

                QRPageStyleComponents.saveStyle(style_name);
                return false;
            },
        });
    },
    saveStyle: function(style_name) {
        $.post(
            "//" + __api_domain + "/user/services/api", {
                cmd: "saveStyle",
                style_id: extractDataFromArray(
                    QRPageStyleComponents.saved_styles, [QRPageStyleComponents.style_selected, "_id"],
                    ""
                ),
                style_config: JSON.stringify(QRPageStyleComponents.style),
                style_name,
                page_type: page,
            },
            function(response) {
                if (response.errorCode == 0) {
                    SwalPopup.showSingleButtonPopup({
                        icon: "success",
                        text: "Style saved",
                    });
                    QRPageStyleComponents.fetchStyles();
                } else {
                    Swal.showValidationMessage(response.errorMsg);
                }
            }
        );
    },
    fetchStyles: function() {
        $.post(
            "//" + __api_domain + "/user/services/api", {
                cmd: "fetchStyles",
                page_type: page
            },
            function(response) {
                QRPageStyleComponents.saved_styles = extractDataFromArray(
                    response, ["data"], []
                );
                if (empty(QRPageStyleComponents.saved_styles)) {
                    QRPageStyleComponents.saved_styles = [];
                }
                $("#saved_style_container").html("");
                QRPageStyleComponents.saved_styles.forEach((style, index) => {
                    $("#saved_style_container").append(
                        QRPageStyleComponents.getSavedStyleWrapper(index, style)
                    );
                });
            }
        );
    },
    deleteStyle: function(style_id) {
        showDeleteConfirmation(
            "Delete Style",
            "Are you sure to delete this style",
            "",
            function() {
                $.post(
                    "//" + __api_domain + "/user/services/api", {
                        cmd: "deleteStyle",
                        style_id: style_id
                    },
                    function(response) {
                        showAlertMessage("S", "Style deleted successfully", () => {
                            QRPageStyleComponents.fetchStyles();
                        });
                    }
                );
            }
        );
    },
};

const QRDesignComponents = {
    _container: "#page-tab-qr-design-content",
    getWrapperHtml: function(type) {
        $(QRDesignComponents._container).html("");
        $(QRDesignComponents._container).append(
            `<div class="card collapse_card mb-3 qr_page_component_card list-group-item" data-type="` +
            type +
            `">
                    <div class="card-header d-flex justify-content-between" aria-expanded="true">
                        <h5 class="mb-0">
                            <a class="btn btn-link ">
                                Cutomize QR Code
                            </a>
                        </h5>
                    </div>
                    <div class="qr_page_component_card_body show secondary_color">
                        <div class="card-body">
                            <div class="row">
                               ` +
            QRDesignComponents.getQRAttibutesHtml() +
            `
                            </div>
                        </div>
                    </div>
                </div>`
        );
    },
    getQRAttibutesHtml: function() {
        const attributes = {
            qrshape: {
                title: "QR SHAPES",
                getPreview: function() {
                    let qrshape = extractDataFromArray(
                        _qrOptions, ["DESIGN_OPTS", "qrshape"],
                        wrapperUrlWithCdn("/assets/images/select.png")
                    );
                    return (
                        `<a class="w-100"><img src="` + qrshape + `" class="img-fluid"></a>`
                    );
                },
                getSelectedClass: function() {
                    return empty(
                            extractDataFromArray(_qrOptions, ["DESIGN_OPTS", "qrshape"], "")
                        ) ?
                        "" :
                        "selected";
                },
                getClickAction: function() {
                    return "showDesignPopUp('#gntr_qrshapes_tab-1'); return false;";
                },
            },
            predesign: {
                title: "PRE-DESIGNED",
                getPreview: function() {
                    let predesign = extractDataFromArray(
                        _qrOptions, ["DESIGN_OPTS", "prebuilt"],
                        "/images/digitalCard/pre_design_qr.png"
                    );
                    if (empty(predesign)) {
                        predesign = "/images/digitalCard/pre_design_qr.png";
                    }
                    return (
                        `<a class="w-100 "><img src="` +
                        predesign +
                        `" class="img-fluid"></a>`
                    );
                },
                getSelectedClass: function() {
                    return empty(
                            extractDataFromArray(_qrOptions, ["DESIGN_OPTS", "prebuilt"], "")
                        ) ?
                        "" :
                        "selected";
                },
                getClickAction: function() {
                    return "showDesignPopUp('#gntr_prebuilt_tab-1'); return false;";
                },
            },
            sticker: {
                title: "STICKERS",
                getPreview: function() {
                    let sticker = extractDataFromArray(
                        _qrOptions, ["DESIGN_OPTS", "sticker"],
                        "/images/digitalCard/stickers_qr.png"
                    );
                    if (empty(sticker)) {
                        sticker = "/images/digitalCard/stickers_qr.png";
                    }
                    return (
                        `<a class="w-100 "><img src="` +
                        sticker +
                        `" class="img-fluid"></a>`
                    );
                },
                getSelectedClass: function() {
                    return empty(
                            extractDataFromArray(_qrOptions, ["DESIGN_OPTS", "sticker"], "")
                        ) ?
                        "" :
                        "selected";
                },
                getClickAction: function() {
                    return "showDesignPopUp('#gntr_sticker_tab-1'); return false;";
                },
            },
            color: {
                title: "COLORS",
                getPreview: function() {
                    return (
                        ` <a class="qr_color_panel_wr">
                                <div class="qr_color_panel_1" style="background: ` +
                        extractDataFromArray(
                            _qrOptions, ["DESIGN_OPTS", "colorpickerSFg"],
                            "#333333"
                        ) +
                        `">
                                </div>
                                <div class="qr_color_panel_2" style="background: ` +
                        extractDataFromArray(
                            _qrOptions, ["DESIGN_OPTS", "colorpickerSEye"],
                            "#333333"
                        ) +
                        `">
                                </div>
                            </a>`
                    );
                },
                getSelectedClass: function() {
                    return "selected";
                },
                getClickAction: function() {
                    return "showDesignPopUp('#gntr_color_tab-1'); return false;";
                },
            },
            shape: {
                title: "SHAPES",
                pointer: ["DESIGN_OPTS", "qrshape"],
                getPreview: function() {
                    return (
                        `<a class="d-flex" style="width:70px">
                    <div class="w-100 mr-2"><img src="` +
                        extractDataFromArray(
                            _qrOptions, ["DESIGN_OPTS", "part-body"],
                            "https://qrcodechimp.s3.amazonaws.com/sysconf/qr-body24.png"
                        ) +
                        `" class="img-fluid"></div>
                    <div class="w-100 mr-2"><img src="` +
                        extractDataFromArray(
                            _qrOptions, ["DESIGN_OPTS", "part-eyeball"],
                            "https://qrcodechimp.s3.amazonaws.com/sysconf/2089-Square.svg"
                        ) +
                        `" class="img-fluid"></div>
                    <div class="w-100"><img src="` +
                        extractDataFromArray(
                            _qrOptions, ["DESIGN_OPTS", "part-eyeframe"],
                            "https://qrcodechimp.s3.amazonaws.com/sysconf/eye-11.svg"
                        ) +
                        `" class="img-fluid"></div></a>`
                    );
                },
                getSelectedClass: function() {
                    return "selected";
                },
                getClickAction: function() {
                    return "showDesignPopUp('#gntr_shape_tab-1'); return false;";
                },
            },
            logo: {
                title: "LOGO",
                pointer: ["DESIGN_OPTS", "qrshape"],
                getPreview: function() {
                    let logo = extractDataFromArray(
                        _qrOptions, ["DESIGN_OPTS", "logo"],
                        "/images/digitalCard/logo_qr.png"
                    );
                    // logo = '';
                    if (empty(logo)) {
                        logo = "/images/digitalCard/logo_qr.png";
                    }
                    return (
                        `<a class="w-100"><img src="` + logo + `" class="img-fluid"></a>`
                    );
                },
                getSelectedClass: function() {
                    return empty(
                            extractDataFromArray(_qrOptions, ["DESIGN_OPTS", "logo"], "")
                        ) ?
                        "" :
                        "selected";
                },
                getClickAction: function() {
                    return "showDesignPopUp('#gntr_logo_tab-1'); return false;";
                },
            },
            decorpic: {
                title: "DECORATE PICTURE",
                pointer: ["DESIGN_OPTS", "qrshape"],
                getPreview: function() {
                    let decorpic = extractDataFromArray(
                        _qrOptions, ["BGImg_details", "conf", "image"],
                        "/images/digitalCard/upload_qr.png"
                    );
                    if (empty(decorpic)) {
                        decorpic = "/images/digitalCard/upload_qr.png";
                    }
                    return (
                        `<a class="w-100"><img src="` +
                        decorpic +
                        `" class="img-fluid"></a>`
                    );
                },
                getSelectedClass: function() {
                    return empty(
                            extractDataFromArray(
                                _qrOptions, ["BGImg_details", "conf", "image"],
                                ""
                            )
                        ) ?
                        "" :
                        "selected";
                },
                getClickAction: function() {
                    return "showDesignPopUp('#gntr_bgimg_tab-1'); return false;";
                },
            },
        };

        let qrAttributesHtml = "";
        Object.keys(attributes).forEach((attribute) => {
            qrAttributesHtml +=
                `<div class="col-6 col-md-3 ">
                                    <div class="qr_design_card_wrapper ` +
                attributes[attribute].getSelectedClass() +
                `" onclick="` +
                attributes[attribute].getClickAction() +
                `">
                                        <div class="">` +
                attributes[attribute].title +
                `</div>
                                        <div class="d-flex justify-content-center align-items-center qr_design_card">` +
                attributes[attribute].getPreview() +
                `</div>
                                    </div>
                                </div>`;
        });
        return qrAttributesHtml;
    },
};

const HrefLinks = function(type, data) {
    switch (type) {
        case "upi":
            return formUPIurl(linkData);
        case "email":
            return "mailto:" + data;
        case "sms":
            return "sms:" + data;
        case "whatsapp":
            if (data.includes("https://wa.me")) {
                return data;
            }
            return "https://wa.me/" + data;
        case "mobile":
            return "tel:" + data;
        case "tel":
            return "tel:" + data;
        case "fax":
            return "fax:" + data;
        case "skype":
            if (data.startsWith("/skype?user")) {
                return data;
            }
            return "/skype?user=" + data;
        case "viber":
            if (data.startsWith("viber:")) {
                return data;
            }
            return "viber://chat?number=" + data;
        case "wechat":
            if (data.startsWith("weixin://dl")) {
                return data;
            }
            return "weixin://dl/chat?" + data;
        default:
            return checkAndAdjustURL(data);
    }
};

const ComponentLists = {
    profile: {
        getContactShortcutItem: function(type, value = "", _id = "") {
            if (empty(type)) {
                return "";
            }
            let optionsHtml = "";
            Object.keys(QRPageComponentWrapper.contactOptions).forEach((option) => {
                optionsHtml +=
                    '<option value="' +
                    option +
                    '" ' +
                    (option == type ? "selected" : "") +
                    ">" +
                    QRPageComponentWrapper.contactOptions[option].label +
                    "</option>";
            });

            if (empty(_id)) {
                _id = QRPageComponents.getUniqueId();
            }

            return (
                `<div class="list-group-item subcomponent_sortable_wrapper contact_shortcut_input_wrapper mb-4" data-id="` +
                _id +
                `">
                        ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-contact"><i class="icon-drag_1"></i></a>
                        </div>`) +
                `
                        <div class=""></div>
                        <div class="input-group my-3">
                            <div class="input-group-prepend">
                                <select class="form-control select2_no_search profile_contact_info" name="type"  ` +
                (QRPageComponents.isBulkUploadQRCode() ? "disabled" : "") +
                `>` +
                optionsHtml +
                `</select>
                            </div>
                            <input type="text" class="form-control" name="value" value="` +
                value +
                `" placeholder="` +
                QRPageComponentWrapper.contactOptions[type].placeholder +
                `">
                        </div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getDraggableContactIconsWrapper(data) {
                let shortcuts = extractDataFromArray(data, ["contact_shortcuts"], []);
                let shortcutsHtml = "";
                shortcuts.forEach((shortcut) => {
                    shortcutsHtml += ComponentLists.profile.getContactShortcutItem(
                        extractDataFromArray(shortcut, ["type"], ""),
                        extractDataFromArray(shortcut, ["value"], ""),
                        extractDataFromArray(shortcut, ["_id"], "")
                    );
                });
                let addDropdownOptions = "";
                Object.keys(QRPageComponentWrapper.contactOptions).forEach((option) => {
                    addDropdownOptions +=
                        '<a class="dropdown-item" href="" data-type="' +
                        option +
                        '">' +
                        QRPageComponentWrapper.contactOptions[option].label +
                        "</a>";
                });

                return (
                    `<div class="col-md-12 px-3 mt-2">
                            <div class="row mx-0">
                                <div class="mr-2 mb-2" >Profile Connect Icons</div>` +
                    QRPageComponentWrapper.getSwitcheryButton(
                        "contact_shortcut_enable",
                        extractDataFromArray(data, ["contact_shortcut_enable"], 0)
                    ) +
                    `
                            </div>
                            <div class="contact_shortcut_container" style="` +
                    (!empty(extractDataFromArray(data, ["contact_shortcut_enable"], 0)) ?
                        "" :
                        "display:none;") +
                    `">
                                <div class="row mx-0 list-group  " id="contact_shortcut_container_` +
                    index +
                    `" >
                                    ` +
                    shortcutsHtml +
                    `
                                </div>
                                <div class="row mx-0 mt-2" >
                                    <div class="dropup">
                                        ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        `
                                        <button class="btn btn-outline-primary dropdown-toggle" type="button" id="btn_add_profile_component" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="icon-add_1"></i>Add More
                                        </button>`) +
                    `                                    
                                        
                                        <div class="dropdown-menu add_profile_component" aria-labelledby="btn_add_profile_component">
                                            ` +
                    addDropdownOptions +
                    `
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                );
            }

            if (
                (typeof __savedQrCodeParams == "undefined" ||
                    empty(extractDataFromArray(__savedQrCodeParams, ["id"], ""))) &&
                isUserLoggedIn()
            ) {
                let default_pr = extractDataFromArray(
                    user_info, ["default_profile_img"],
                    ""
                );
                if (!empty(default_pr)) {
                    data.pr_img = default_pr;
                }
            }

            let template_content = getComponentContentFromTemplate(
                QRPageComponents.selected_template
            );
            template_profile = extractDataFromArray(template_content, ["0"], "");

            $show_brand_img = !empty(extractDataFromArray(data, ["show_brand_img"], 0)) &&
                !empty(extractDataFromArray(template_profile, ["show_brand_img"], 0));
            $show_pr_bg_img = !empty(extractDataFromArray(data, ["show_pr_bg_img"], 0)) &&
                !empty(extractDataFromArray(template_profile, ["show_pr_bg_img"], 0));

            let imageLabel = (page == "businesspage") ? "Brand Photo" : "Profile Photo";

            let profile_img_section = QRPageComponentWrapper.getImageUploader(
                imageLabel, [extractDataFromArray(data, ["pr_img"], "")],
                extractDataFromArray(
                    data, ["pr_img_label"],
                    extractDataFromArray(
                        template_profile, ["pr_img_label"],
                        "(200x200px, 1:1 Ratio)"
                    )
                ),
                "",
                1,
                extractDataFromArray(data, ["enable_pr"], 1),
                12,
                "pr_img",
                "bottom"
            );
            if ($show_brand_img && $show_pr_bg_img) {
                profile_img_section =
                    QRPageComponentWrapper.getImageUploader(
                        "Profile Photo", [extractDataFromArray(data, ["pr_img"], "")],
                        extractDataFromArray(
                            data, ["pr_img_label"],
                            extractDataFromArray(
                                template_profile, ["pr_img_label"],
                                "(250x250px, 1:1 Ratio)"
                            )
                        ),
                        "",
                        1,
                        extractDataFromArray(data, ["enable_pr"], 1),
                        4,
                        "pr_img",
                        "bottom"
                    ) +
                    QRPageComponentWrapper.getImageUploader(
                        "Brand Logo", [extractDataFromArray(data, ["br_img"], "")],
                        extractDataFromArray(
                            data, ["br_img_label"],
                            extractDataFromArray(
                                template_profile, ["br_img_label"],
                                "(250x250px, 1:1 Ratio)"
                            )
                        ),
                        "",
                        1,
                        extractDataFromArray(data, ["enable_br"], 1),
                        4,
                        "br_img",
                        "bottom"
                    ) +
                    QRPageComponentWrapper.getImageUploader(
                        "Profile Background", [extractDataFromArray(data, ["pr_bg_img"], "")],
                        extractDataFromArray(
                            data, ["pr_bg_img_label"],
                            extractDataFromArray(
                                template_profile, ["pr_bg_img_label"],
                                "(250x250px, 1:1 Ratio)"
                            )
                        ),
                        "",
                        1,
                        extractDataFromArray(data, ["enable_pr_bg"], 1),
                        4,
                        "pr_bg_img",
                        "bottom"
                    );
            } else if ($show_brand_img) {
                profile_img_section =
                    QRPageComponentWrapper.getImageUploader(
                        "Profile Photo", [extractDataFromArray(data, ["pr_img"], "")],
                        extractDataFromArray(
                            data, ["pr_img_label"],
                            extractDataFromArray(
                                template_profile, ["pr_img_label"],
                                "(250x250px, 1:1 Ratio)"
                            )
                        ),
                        "",
                        1,
                        extractDataFromArray(data, ["enable_pr"], 1),
                        6,
                        "pr_img",
                        "bottom"
                    ) +
                    QRPageComponentWrapper.getImageUploader(
                        "Brand Logo", [extractDataFromArray(data, ["br_img"], "")],
                        extractDataFromArray(
                            data, ["br_img_label"],
                            extractDataFromArray(
                                template_profile, ["br_img_label"],
                                "(250x250px, 1:1 Ratio)"
                            )
                        ),
                        "",
                        1,
                        extractDataFromArray(data, ["enable_br"], 1),
                        6,
                        "br_img",
                        "bottom"
                    );
            } else if ($show_pr_bg_img) {
                profile_img_section =
                    QRPageComponentWrapper.getImageUploader(
                        "Profile Photo", [extractDataFromArray(data, ["pr_img"], "")],
                        extractDataFromArray(
                            data, ["pr_img_label"],
                            extractDataFromArray(
                                template_profile, ["pr_img_label"],
                                "(250x250px, 1:1 Ratio)"
                            )
                        ),
                        "",
                        1,
                        extractDataFromArray(data, ["enable_pr"], 1),
                        6,
                        "pr_img",
                        "bottom"
                    ) +
                    QRPageComponentWrapper.getImageUploader(
                        "Profile Background", [extractDataFromArray(data, ["pr_bg_img"], "")],
                        extractDataFromArray(
                            data, ["pr_bg_img_label"],
                            extractDataFromArray(
                                template_profile, ["pr_bg_img_label"],
                                "(250x250px, 1:1 Ratio)"
                            )
                        ),
                        "",
                        1,
                        extractDataFromArray(data, ["enable_pr_bg"], 1),
                        6,
                        "pr_bg_img",
                        "bottom"
                    );
            }

            let profile_column = (page == "businesspage") ? 12 : 6;

            return (
                profile_img_section +
                QRPageComponentWrapper.getInputText(
                    "Name",
                    "name",
                    extractDataFromArray(data, ["name"], "")
                ) +
                QRPageComponentWrapper.getInputText(
                    "Heading",
                    "desc",
                    extractDataFromArray(data, ["desc"], ""),
                    profile_column
                ) +
                (page == "businesspage" ? '' : QRPageComponentWrapper.getInputText(
                    "Sub Heading",
                    "company",
                    extractDataFromArray(data, ["company"], ""),
                    6
                )) +
                getDraggableContactIconsWrapper(data)
            );
        },
        title: "Profile",
        listeners: function(index) {
            new Sortable(
                document.getElementById("contact_shortcut_container_" + index), {
                    handle: ".handle-contact", // handle class
                    animation: 150,
                    ghostClass: "blue-background-class",
                    onEnd: function(e) {
                        // debugger
                        QRPageComponents.handleInputChange(e);
                    },
                }
            );
        },
        getInputData: function(index, parent) {
            let pr_img = $(parent)
                .find(".img_uploaded_card.selected_img.pr_img")
                .css("background-image");
            if (!empty(pr_img)) {
                pr_img = pr_img.split('"')[1];
            }

            pr_img = checkAndValidateImgURL(pr_img);

            let br_img = $(parent).find(".img_uploaded_card.selected_img.br_img");
            if (br_img.length == 1) {
                br_img = br_img.css("background-image");
                br_img = br_img.split('"')[1];
            } else {
                br_img = "";
            }

            let template_content = getComponentContentFromTemplate(
                QRPageComponents.selected_template
            );
            template_profile = extractDataFromArray(template_content, ["0"], "");

            br_img = checkAndValidateImgURL(br_img);

            let pr_bg_img = $(parent).find(
                ".img_uploaded_card.selected_img.pr_bg_img"
            );
            if (pr_bg_img.length == 1) {
                pr_bg_img = pr_bg_img.css("background-image");
                pr_bg_img = pr_bg_img.split('"')[1];
            } else {
                pr_bg_img = "";
            }

            pr_bg_img = checkAndValidateImgURL(pr_bg_img);

            // let pr_bg_img = $(parent).find(".img_uploaded_card.selected_img").css("background-image")
            // if (!empty(pr_bg_img)) {
            //     pr_img = pr_bg_img.split('"')[1]
            // }pr_bg_img
            let contact_shortcuts = [];
            Array.from($(parent).find(".contact_shortcut_input_wrapper")).forEach(
                (ele) => {
                    contact_shortcuts.push({
                        _id: $(ele).data("id"),
                        type: $(ele).find("select").val(),
                        value: $(ele).find("input").val(),
                    });
                }
            );
            let extra_attributes = {};

            if (
                (typeof QRPageComponents.components[index]["show_brand_img"] !=
                    "undefined" && !empty(QRPageComponents.components[index]["show_brand_img"])) ||
                typeof template_profile["show_brand_img"] != "undefined"
            ) {
                extra_attributes["show_brand_img"] = 1;
                // if (!empty(br_img)) {
                // }
                if ($(parent).find("input[name=enable_br]").length == 1) {
                    extra_attributes["enable_br"] = $(parent)
                        .find("input[name=enable_br]")
                        .prop("checked") ?
                        1 :
                        0;
                } else {
                    extra_attributes["enable_br"] = extractDataFromArray(
                        QRPageComponents.components, [index, "enable_br"],
                        0
                    );
                }
                extra_attributes["br_img"] = empty(br_img) ?
                    extractDataFromArray(
                        QRPageComponents.components, [index, "br_img"],
                        0
                    ) :
                    br_img;
            }

            if (
                (typeof QRPageComponents.components[index]["show_pr_bg_img"] !=
                    "undefined" && !empty(QRPageComponents.components[index]["show_brand_img"])) ||
                typeof template_profile["show_pr_bg_img"] != "undefined"
            ) {
                extra_attributes["show_pr_bg_img"] = 1;
                // if (!empty(pr_bg_img)) {
                // }
                // extra_attributes['show_pr_bg_img'] = 1
                if ($(parent).find("input[name=enable_pr_bg]").length == 1) {
                    extra_attributes["enable_pr_bg"] = $(parent)
                        .find("input[name=enable_pr_bg]")
                        .prop("checked") ?
                        1 :
                        0;
                } else {
                    extra_attributes["enable_pr_bg"] = extractDataFromArray(
                        QRPageComponents.components, [index, "enable_pr_bg"],
                        0
                    );
                }
                extra_attributes["pr_bg_img"] = empty(pr_bg_img) ?
                    extractDataFromArray(
                        QRPageComponents.components, [index, "pr_bg_img"],
                        0
                    ) :
                    pr_bg_img;
            }

            return {
                pr_img,
                name: $(parent).find("input[name=name]").val(),
                desc: $(parent).find("input[name=desc]").val(),
                company: $(parent).find("input[name=company]").val(),
                contact_shortcut_enable: $(parent)
                    .find("input[name=contact_shortcut_enable]")
                    .prop("checked") ?
                    1 :
                    0,
                enable_pr: $(parent).find("input[name=enable_pr]").prop("checked") ?
                    1 :
                    0,
                contact_shortcuts,
                ...extra_attributes,
            };
        },
        getPreviewHtml: function(data) {
            // QRPageComponents.getPrBase64(extractDataFromArray(data, ['pr_img'], ''))
            let profileHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "profile"
            );
            let profileHtml = extractDataFromArray(profileHtmlConfig, ["main"], "");

            //name replacement
            QRPageComponents.profile_name = extractEscapeHtmlDataFromArray2(
                data, ["name"],
                ""
            );
            let nameHtml = extractDataFromArray(profileHtmlConfig, ["name"], "");
            nameHtml = nameHtml.cleanReplace(
                "___name___",
                QRPageComponents.profile_name
            );
            profileHtml = profileHtml.cleanReplace("___name_html___", nameHtml);

            //desc replacement
            let descHtml = extractDataFromArray(profileHtmlConfig, ["desc"], "");
            descHtml = descHtml.cleanReplace(
                "___desc___",
                extractEscapeHtmlDataFromArray2(data, ["desc"], "")
            );
            profileHtml = profileHtml.cleanReplace("___desc_html___", descHtml);

            //company replacement
            let companyHtml = extractDataFromArray(
                profileHtmlConfig, ["company"],
                ""
            );
            companyHtml = companyHtml.cleanReplace(
                "___company___",
                extractEscapeHtmlDataFromArray2(data, ["company"], "")
            );
            profileHtml = profileHtml.cleanReplace("___company_html___", companyHtml);

            //pr_img replacement
            let pr_img_html = "";
            if (parseInt(extractDataFromArray(data, ["enable_pr"], 1))) {
                let pr_img = extractDataFromArray(data, ["pr_img"], "");
                if (empty(pr_img)) {
                    pr_img = "";
                }
                if (!empty(pr_img) && pr_img.indexOf("/images") < 0) {
                    pr_img = pr_img.split(".");
                    if (pr_img[pr_img.length - 1] != "gif") {
                        pr_img[pr_img.length - 2] += "_m";
                    }
                    pr_img = pr_img.join(".");
                }
                if (!empty(pr_img)) {
                    pr_img_html = profileHtmlConfig.pr_img.cleanReplace(
                        "___pr_img___",
                        pr_img
                    );
                } else if (
                    parseInt(
                        extractDataFromArray(
                            getComponentContentFromTemplate(
                                QRPageComponents.selected_template
                            ), [0, "remove_only_pr_img"],
                            0
                        )
                    )
                ) {
                    pr_img_html = profileHtmlConfig.pr_img.cleanReplace(
                        "___pr_img___",
                        ""
                    );
                }
            } else if (
                parseInt(
                    extractDataFromArray(
                        getComponentContentFromTemplate(QRPageComponents.selected_template), [0, "remove_only_pr_img"],
                        0
                    )
                )
            ) {
                pr_img_html = profileHtmlConfig.pr_img.cleanReplace("___pr_img___", "");
            }

            profileHtml = profileHtml.cleanReplace("___pr_img_html___", pr_img_html);
            profileHtml = profileHtml.cleanReplace("___pr_pic___", pr_img_html);

            //br_img replacement
            let br_img_html = "";

            if (
                parseInt(extractDataFromArray(data, ["enable_br"], 0)) &&
                parseInt(
                    extractDataFromArray(
                        getComponentContentFromTemplate(QRPageComponents.selected_template), [0, "show_brand_img"],
                        0
                    )
                )
            ) {
                let br_img = extractDataFromArray(data, ["br_img"], "");
                if (empty(br_img)) {
                    br_img = "";
                }
                if (!empty(br_img)) {
                    br_img_html = profileHtmlConfig.br_img.cleanReplace(
                        "___br_img___",
                        br_img
                    );
                }
                if (
                    empty(br_img) &&
                    parseInt(
                        extractDataFromArray(
                            getComponentContentFromTemplate(
                                QRPageComponents.selected_template
                            ), [0, "remove_only_br_img"],
                            0
                        )
                    )
                ) {
                    br_img_html = profileHtmlConfig.br_img.cleanReplace(
                        "___br_img___",
                        ""
                    );
                }
            } else if (
                parseInt(
                    extractDataFromArray(
                        getComponentContentFromTemplate(QRPageComponents.selected_template), [0, "remove_only_br_img"],
                        0
                    )
                )
            ) {
                br_img_html = profileHtmlConfig.br_img.cleanReplace("___br_img___", "");
            }

            profileHtml = profileHtml.cleanReplace("___br_img_html___", br_img_html);

            let pr_bg_img_html = "";
            if (
                parseInt(extractDataFromArray(data, ["enable_pr_bg"], 0)) &&
                parseInt(extractDataFromArray(data, ["show_pr_bg_img"], 0)) &&
                parseInt(
                    extractDataFromArray(
                        getComponentContentFromTemplate(QRPageComponents.selected_template), [0, "show_pr_bg_img"],
                        0
                    )
                )
            ) {
                let pr_bg_img = extractDataFromArray(data, ["pr_bg_img"], "");
                if (empty(pr_bg_img)) {
                    pr_bg_img = "";
                }
                if (!empty(pr_bg_img)) {
                    pr_bg_img_html = profileHtmlConfig.pr_bg_img.cleanReplace(
                        "___pr_bg_img___",
                        pr_bg_img
                    );
                }
                if (
                    empty(pr_bg_img) &&
                    parseInt(
                        extractDataFromArray(
                            getComponentContentFromTemplate(
                                QRPageComponents.selected_template
                            ), [0, "remove_only_pr_bg_img"],
                            0
                        )
                    )
                ) {
                    pr_bg_img_html = profileHtmlConfig.pr_bg_img.cleanReplace(
                        "___pr_bg_img___",
                        ""
                    );
                }
            } else if (
                parseInt(
                    extractDataFromArray(
                        getComponentContentFromTemplate(QRPageComponents.selected_template), [0, "remove_only_pr_bg_img"],
                        0
                    )
                )
            ) {
                pr_bg_img_html = profileHtmlConfig.pr_bg_img.cleanReplace(
                    "___pr_bg_img___",
                    ""
                );
            }

            profileHtml = profileHtml.cleanReplace(
                "___pr_bg_img_html___",
                pr_bg_img_html
            );

            let shortcut = "";
            extractDataFromArray(data, ["contact_shortcuts"], []).forEach(
                (item, index) => {
                    data["contact_shortcuts"][index]["_id"] =
                        typeof data["contact_shortcuts"][index]["_id"] == "undefined" ?
                        QRPageComponents.getUniqueId() :
                        data["contact_shortcuts"][index]["_id"];
                }
            );

            if (
                parseInt(extractDataFromArray(data, ["contact_shortcut_enable"], 0))
            ) {
                let shortcutItemHtml = "";
                extractDataFromArray(data, ["contact_shortcuts"], []).forEach(
                    (item) => {
                        if (!empty(extractDataFromArray(item, ["value"], ""))) {
                            let linkHtml = profileHtmlConfig.item.cleanReplace(
                                "___item_link___",
                                HrefLinks(item.type, item.value)
                            );
                            linkHtml = linkHtml.cleanReplace(
                                "___item_icon___",
                                QRPageComponentWrapper.contactOptions[item.type].icon
                            );

                            if (extractDataFromArray(item, ["type"], "") == 'wechat') {
                                linkHtml = `<li class="qr_cc_card"><a onclick="if(typeof triggerSocialUrlClicked == 'function') return triggerSocialUrlClicked(this);" href="${HrefLinks(item.type, item.value)}"><span class="${QRPageComponentWrapper.contactOptions[item.type].icon}"></span></a></li>`
                            }

                            shortcutItemHtml += linkHtml;
                        }
                    }
                );
                if (!empty(shortcutItemHtml)) {
                    shortcut = profileHtmlConfig.shortcut.cleanReplace(
                        "___shortcut_items___",
                        shortcutItemHtml
                    );
                }
            }
            profileHtml = profileHtml.cleanReplace("___shortcut_html___", shortcut);
            // profileHtml = profileHtml.cleanReplace(/qr_cc_card/g, getCardClass(data))
            if (
                empty(nameHtml) &&
                empty(descHtml) &&
                empty(companyHtml) &&
                empty(pr_img_html) &&
                empty(br_img_html) &&
                empty(pr_bg_img_html) &&
                empty(shortcut)
            ) {
                return "";
            }
            return profileHtml;
        },
        default: {
            component: "profile",
            pr_img: "/images/digitalCard/profilepic.jpg",
            name: "Name",
            desc: "Job Title",
            company: "Company",
            contact_shortcut_enable: 1,
            contact_shortcuts: [{
                    type: "mobile",
                    value: ""
                },
                {
                    type: "email",
                    value: ""
                },
                {
                    type: "sms",
                    value: ""
                },
            ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";
            columns.push(component_order + "Profile Name");
            samples.push(extractDataFromArray(component, ["name"], ""));

            columns.push(component_order + "Profile Heading");
            samples.push(extractDataFromArray(component, ["desc"], ""));

            if ('company' in component) {
                columns.push(component_order + "Profile Sub Heading");
                samples.push(extractDataFromArray(component, ["company"], ""));
            }

            // columns.push(component_order + "Show Profile Image")
            // samples.push(extractDataFromArray(component, ['enable_pr'], 1) ? 'Y' : 'N')

            if (parseInt(extractDataFromArray(component, ["enable_pr"], 1))) {
                let image_header = (page == 'businesspage') ? 'Brand Photo' : 'Profile Image';
                columns.push(component_order + image_header);
                samples.push(extractDataFromArray(component, ["pr_img"], ""));
            }

            // columns.push(component_order + "Show Profile Shortcuts")
            // samples.push(extractDataFromArray(component, ['contact_shortcut_enable'], 1) ? 'Y' : 'N')

            if (
                parseInt(
                    extractDataFromArray(component, ["contact_shortcut_enable"], 1)
                )
            ) {
                extractDataFromArray(component, ["contact_shortcuts"], []).forEach(
                    (shortcut, index) => {
                        columns.push(
                            component_order + "Profile Shortcut:" + (index + 1) + ".type"
                        );
                        samples.push(extractDataFromArray(shortcut, ["type"], ""));

                        columns.push(
                            component_order + "Profile Shortcut:" + (index + 1) + ".value"
                        );
                        samples.push(extractDataFromArray(shortcut, ["value"], ""));
                    }
                );
            }
        },
    },
    logo: {
        getInputWrapperHtml: function(data, index) {
            let profile_img_section = QRPageComponentWrapper.getImageUploader(
                "", [extractDataFromArray(data, ["pr_img"], "")],
                "",
                "",
                0,
                0,
                6,
                "pr_img",
                "bottom"
            );

            return (
                profile_img_section +
                `<div class="col-md-6">
            <label>Corners</label>
            <div class="d-block">
                <input type="range" min="0" max="50" value="` +
                extractDataFromArray(data, ["border_radius"], 50) +
                `" class="slider sliderInput logo_radius_slider"   style="width:100%; ">
            </div>
        </div>`
            );
        },
        title: "Logo",
        listeners: function(index) {},
        getInputData: function(index, parent) {
            let pr_img = $(parent)
                .find(".img_uploaded_card.selected_img.pr_img")
                .css("background-image");
            if (!empty(pr_img)) {
                pr_img = pr_img.split('"')[1];
            }

            pr_img = checkAndValidateImgURL(pr_img);

            return {
                pr_img,
                border_radius: $(parent).find(".logo_radius_slider").val(),
            };
        },
        getPreviewHtml: function(data) {
            // QRPageComponents.getPrBase64(extractDataFromArray(data, ['pr_img'], ''))
            let profileHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "logo"
            );
            let profileHtml = extractDataFromArray(profileHtmlConfig, ["main"], "");

            //pr_img replacement
            let pr_img_html = "";
            if (parseInt(extractDataFromArray(data, ["enable_pr"], 1))) {
                let pr_img = extractDataFromArray(data, ["pr_img"], "");
                if (empty(pr_img)) {
                    pr_img = "";
                }
                if (!empty(pr_img) && pr_img.indexOf("/images") < 0) {
                    pr_img = pr_img.split(".");
                    if (pr_img[pr_img.length - 1] != "gif") {
                        pr_img[pr_img.length - 2] += "_m";
                    }
                    pr_img = pr_img.join(".");
                }
                if (!empty(pr_img)) {
                    pr_img_html = profileHtmlConfig.pr_img.cleanReplace(
                        "___pr_img___",
                        pr_img
                    );
                } else if (
                    parseInt(
                        extractDataFromArray(
                            DigitalBusinessPageTemplates, [
                                QRPageComponents.selected_template,
                                "content",
                                0,
                                "remove_only_pr_img",
                            ],
                            0
                        )
                    )
                ) {
                    pr_img_html = profileHtmlConfig.pr_img.cleanReplace(
                        "___pr_img___",
                        ""
                    );
                }
            } else if (
                parseInt(
                    extractDataFromArray(
                        DigitalBusinessPageTemplates, [
                            QRPageComponents.selected_template,
                            "content",
                            0,
                            "remove_only_pr_img",
                        ],
                        0
                    )
                )
            ) {
                pr_img_html = profileHtmlConfig.pr_img.cleanReplace("___pr_img___", "");
            }

            profileHtml = profileHtml.cleanReplace("___pr_img_html___", pr_img_html);
            profileHtml = profileHtml.cleanReplace("___pr_pic___", pr_img_html);
            profileHtml = profileHtml.cleanReplace(
                "___border_radius___",
                extractDataFromArray(data, ["border_radius"], "50")
            );

            if (empty(pr_img_html)) {
                return "";
            }
            return profileHtml;
        },
        default: {
            component: "logo",
            pr_img: "/images/digitalCard/profilepic.jpg",
        },
    },
    event_profile: {
        getInputWrapperHtml: function(data, index) {
            return (
                QRPageComponentWrapper.getImageUploader(
                    "Event Photo", [extractDataFromArray(data, ["pr_img"], "")],
                    "(400x133px, 3:1 Ratio)",
                    "",
                    1,
                    extractDataFromArray(data, ["enable_pr"], 1),
                    12,
                    "pr_img"
                ) +
                QRPageComponentWrapper.getInputText(
                    "Customer Name",
                    "name",
                    extractDataFromArray(data, ["name"], "")
                ) +
                // + QRPageComponentWrapper.getInputText('Customer Email to Send Ticket', 'cust_email', extractDataFromArray(data, ['cust_email'], ''), 6)
                QRPageComponentWrapper.getInputText(
                    "Event Name",
                    "event_name",
                    extractDataFromArray(data, ["event_name"], ""),
                    6
                ) +
                QRPageComponentWrapper.getInputText(
                    "Description",
                    "desc",
                    extractDataFromArray(data, ["desc"], ""),
                    6
                ) +
                `<div class="col-md-12 mt-3"><div class="mr-2 mb-2 d-inline">QR Code on ticket</div>` +
                QRPageComponentWrapper.getSwitcheryButton(
                    "qr_enable",
                    extractDataFromArray(data, ["qr_enable"], 1)
                ) +
                "</div>"
            );
        },
        title: "Ticket Details",
        listeners: function(index) {},
        getInputData: function(index, parent) {
            let pr_img = $(parent)
                .find(".img_uploaded_card.selected_img")
                .css("background-image");
            if (!empty(pr_img)) {
                pr_img = pr_img.split('"')[1];
            }
            return {
                pr_img,
                name: $(parent).find("input[name=name]").val(),
                desc: $(parent).find("input[name=desc]").val(),
                event_name: $(parent).find("input[name=event_name]").val(),
                cust_email: $(parent).find("input[name=cust_email]").val(),
                enable_pr: $(parent).find("input[name=enable_pr]").prop("checked") ?
                    1 :
                    0,
                qr_enable: $(parent).find("input[name=qr_enable]").prop("checked") ?
                    1 :
                    0,
            };
        },
        getPreviewHtml: function(data) {
            let profileHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "event_profile"
            );
            QRPageComponents.profile_name = extractDataFromArray(data, ["name"], "");
            let profileHtml = profileHtmlConfig.main;
            let prImg = "";

            if (parseInt(extractDataFromArray(data, ["enable_pr"], 1))) {
                prImg = profileHtmlConfig.pr_img.cleanReplace(
                    "___pr_img___",
                    extractDataFromArray(data, ["pr_img"], "")
                );
            }

            profileHtml = profileHtml.cleanReplace("___pr_img_html___", prImg);
            profileHtml = profileHtml.cleanReplace(
                "___event_name___",
                extractDataFromArray(data, ["event_name"], "")
            );
            profileHtml = profileHtml.cleanReplace(
                "___event_desc___",
                extractDataFromArray(data, ["desc"], "")
            );
            profileHtml = profileHtml.cleanReplace(
                "___name___",
                extractDataFromArray(data, ["name"], "")
            );

            // let qr_code = ''
            // if (!empty(extractDataFromArray(data, ['qr_enable'], 1))) {
            //     qr_code = profileHtmlConfig.qr_code.cleanReplace("___name___", extractDataFromArray(data, ['name'], ''))
            // qr_code = qr_code.cleanReplace("___name___", extractDataFromArray(data, ['name'], ''))
            // }
            // profileHtml = profileHtml.cleanReplace("___qr_code___", qr_code)
            // profileHtml = profileHtml.cleanReplace("___qr_img___", extractDataFromArray(data, ['company'], ''))

            let qrImg = "";
            if (parseInt(extractDataFromArray(data, ["qr_enable"], 1))) {
                let qr_img_path = "";
                let searchParams = new URLSearchParams(window.location.search);
                let timestamp = new Date().getTime();
                let randomNumber = Math.floor(Math.random() * timestamp);
                let vValue = searchParams.get('v') == null ? randomNumber : searchParams.get('v');

                if (extractDataFromArray(__savedQrCodeParams, ['qr_img'], '') !== '' && page != "displayPage") {
                    // qr_img_path = __savedQrCodeParams['qr_img'];
                    // console.log("entering 1", qr_img_path)
                    // if (!empty(qr_img_path)) {
                    //     let imgT = qr_img_path.split('.')
                    //     if (imgT && !imgT[imgT.length - 2].endsWith("_t")) {
                    //         imgT[imgT.length - 2] = imgT[imgT.length - 2] + "_t"
                    //     }
                    //     qr_img_path = imgT.join(".");
                    //     qr_img_path = qr_img_path + "?v=" + vValue;
                    // }
                    qr_img_path = $("#qrcode_preview").attr("src");
                } else if (page != "displayPage") {
                    qr_img_path = $("#qrcode_preview").attr("src");
                } else {

                    qr_img_path = _qr_img_path;
                    if (!empty(qr_img_path)) {
                        let imgT = qr_img_path.split('.')
                        if (imgT && !imgT[imgT.length - 2].endsWith("_t")) {
                            imgT[imgT.length - 2] = imgT[imgT.length - 2] + "_t"
                        }
                        qr_img_path = imgT.join(".");
                        qr_img_path = qr_img_path + "?v=" + vValue;
                    }
                }
                if (qr_img_path !== "") {
                    qrImg = profileHtmlConfig.qr_code.cleanReplace(
                        "___qr_img___",
                        qr_img_path
                    );
                } else {
                    if (page == "displayPage") {
                        qrImg = profileHtmlConfig.qr_code.cleanReplace("___qr_img___", "");
                    }
                }
            }

            profileHtml = profileHtml.cleanReplace("___qr_code___", qrImg);

            let lockConfig = extractDataFromArray(
                QRPageComponents.page_setting, ["lock_code"], {}
            );
            let lockImg = '';
            if (typeof _show_after_lock != 'undefined' && parseInt(_show_after_lock) == 1) {
                lockImg = profileHtmlConfig.floating_button.cleanReplace("___lock_img___", extractDataFromArray(lockConfig, ["lock_img"], "/images/lock_image.svg"))
            }

            profileHtml = profileHtml.cleanReplace("___lock_button___", lockImg);

            // profileHtml = profileHtml.cleanReplace(/qr_cc_card/g, getCardClass(data))
            return profileHtml;
        },
        default: {
            component: "profile",
            pr_img: "/images/digitalCard/profilepic.jpg",
            name: "Name",
            desc: "Job Title",
            company: "Company",
            contact_shortcut_enable: 1,
            contact_shortcuts: [{
                    type: "mobile",
                    value: ""
                },
                {
                    type: "email",
                    value: ""
                },
                {
                    type: "sms",
                    value: ""
                },
            ],
        },
    },
    social_link: {
        socialLinks: {
            facebook: {
                title: "Facebook",
                icon: "/images/digitalCard/fb_icon@72x.png",
            },
            instagram: {
                title: "Instagram",
                icon: "/images/digitalCard/insta_icon@72x.png",
            },
            linkedin: {
                title: "LinkedIn",
                icon: "/images/digitalCard/linkedin_icon@72x.png",
            },
            twitter: {
                title: "Twitter",
                icon: "/images/digitalCard/tw_icon@72x.png",
            },
            skype: {
                title: "Skype",
                icon: "/images/digitalCard/skype_icon.png"
            },
            behance: {
                title: "Behance",
                icon: "/images/digitalCard/behance_icon.png",
            },
            snapchat: {
                title: "Snapchat",
                icon: "/images/digitalCard/snapchat_icon@72x.png",
            },
            xing: {
                title: "Xing",
                icon: "/images/digitalCard/xing_icon.png"
            },
            youtube: {
                title: "YouTube",
                icon: "/images/digitalCard/youtube_icon@72x.png",
            },
            weburl: {
                title: "Webpage",
                icon: "/images/digitalCard/website_icon.png",
            },
            website: {
                title: "Webpage",
                icon: "/images/digitalCard/website_icon.png",
            },
            whatsapp: {
                title: "Whatsapp",
                icon: "/images/digitalCard/whatsapp_icon@72x.png",
            },
            pinterest: {
                title: "Pinterest",
                icon: "/images/digitalCard/pin_icon@72x.png",
            },
            location: {
                title: "Location",
                icon: "/images/digitalCard/location_icon.png",
            },
            email: {
                title: "Email",
                icon: "/images/digitalCard/email_icon.png"
            },
            telegram: {
                title: "Telegram",
                icon: "/images/digitalCard/telegram_icon@72x.png",
            },
            tiktok: {
                title: "TikTok",
                icon: "/images/digitalCard/tiktok_icon.png"
            },
            viber: {
                title: "Viber",
                icon: "/images/digitalCard/viber_icon.png"
            },
            wechat: {
                title: "WeChat",
                icon: "/images/digitalCard/wechat_icon.png"
            },
            other: {
                title: "Other",
                icon: "/images/digitalCard/others_icon_1.png"
            },
        },
        getSocialLinkItem: function(data) {
            let optionsHtml = "";
            Object.keys(ComponentLists.social_link.socialLinks).forEach((option) => {
                if (option == "weburl") {
                    return;
                }
                optionsHtml +=
                    '<option value="' +
                    option +
                    '" ' +
                    (option == data.type ? "selected" : "") +
                    ">" +
                    ComponentLists.social_link.socialLinks[option].title +
                    "</option>";
            });
            // console.log(optionsHtml)

            return (
                `<div class="list-group-item social_link_input_wrapper subcomponent_sortable_wrapper mb-4"  data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `">
            ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-social-link"><i class="icon-drag_1"></i></a>
                        </div> `) +
                `
                        <div class=""></div>
                        <div class="input-group my-3">
                            <div class="input-group-prepend">
                                <select class="form-control select2_no_search social_media_select" name="type" ` +
                (QRPageComponents.isBulkUploadQRCode() ? "disabled" : "") +
                ` >` +
                optionsHtml +
                `</select>
                            </div>
                            <input type="text" class="form-control" name="url" value="` +
                data.url +
                `" placeholder="URL">
                        </div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getImageUploader("", [
                    extractDataFromArray(
                        data, ["icon_img"],
                        extractDataFromArray(
                            ComponentLists, [
                                "social_link",
                                "socialLinks",
                                extractDataFromArray(data, ["type"], ""),
                                "icon",
                            ],
                            ""
                        )
                    ),
                ]) +
                `
                        </div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getInputText("Title", "title", data.title, 6) +
                `
                            ` +
                QRPageComponentWrapper.getInputText(
                    "Subtitle",
                    "subtitle",
                    data.subtitle,
                    6,
                    "subtitle_enable",
                    data.subtitle_enable
                ) +
                `
                        </div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getDraggableLinkWrapper(data) {
                let links = extractDataFromArray(data, ["links"], []);
                let linksHtml = "";
                links.forEach((link) => {
                    linksHtml += ComponentLists.social_link.getSocialLinkItem(link);
                });
                return (
                    QRPageComponentWrapper.getTitleDescSection(
                        extractDataFromArray(data, ["title"], ""),
                        extractDataFromArray(data, ["desc"], ""),
                        parseInt(extractDataFromArray(data, ["header_enable"], 0))
                    ) +
                    `<div class="col-md-12 px-3">
                    <div class="row mx-0 list-group mt-3" id="social_link_container_` +
                    index +
                    `">
                        ` +
                    linksHtml +
                    `
                    </div>
                    ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        `
                    <div class="row mx-0 mt-2 btn_add_social_link" >
                        <button class="btn btn-outline-primary" ><i class="icon-add_1"></i>Add Link</button>
                    </div>`) +
                    `
                </div>`
                );
            }

            return getDraggableLinkWrapper(data);
        },
        title: "Social Links",
        listeners: function(index) {
            new Sortable(document.getElementById("social_link_container_" + index), {
                handle: ".handle-social-link", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let links = [];
            Array.from($(parent).find(".social_link_input_wrapper")).forEach(
                (ele) => {
                    let icon_img = $(ele)
                        .find(".img_uploaded_card.selected_img")
                        .css("background-image");
                    if (!empty(icon_img)) {
                        icon_img = icon_img.split('"')[1];
                    }
                    links.push({
                        type: $(ele).find("select").val(),
                        url: $(ele).find("input[name=url]").val(),
                        title: $(ele).find("input[name=title]").val(),
                        subtitle: $(ele).find("input[name=subtitle]").val(),
                        subtitle_enable: $(ele)
                            .find("input[name=subtitle_enable]")
                            .prop("checked") ?
                            1 :
                            0,
                        icon_img,
                        _id: $(ele).data("id"),
                    });
                }
            );
            return {
                ...header,
                links,
            };
        },
        getPreviewHtml: function(data) {
            let socialLinksHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "social_link"
            );

            let main = socialLinksHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, socialLinksHtmlConfig);

            function getLinkHtml(link_data, index) {
                if (empty(link_data)) {
                    return '<li class="qr_cc_card no_data">' + headerHtml + "</li>";
                }
                let linkHtml = socialLinksHtmlConfig.item;

                if (empty(extractDataFromArray(link_data, ["url"], ""))) {
                    return "";
                }

                linkHtml = linkHtml.cleanReplace("___header_html___", headerHtml);

                headerHtml = "";

                let subtitle = "";
                if (parseInt(extractDataFromArray(link_data, ["subtitle_enable"], 0))) {
                    subtitle = socialLinksHtmlConfig.subtitle.cleanReplace(
                        "___subtitle___",
                        extractDataFromArray(link_data, ["subtitle"], "")
                    );
                }
                linkHtml = linkHtml.cleanReplace("___item_subtitle___", subtitle);

                // let link_url = extractDataFromArray(link_data, ['type'], '') == 'email' ? 'mailto:'+extractDataFromArray(link_data, ['url'], '') : checkAndAdjustURL(extractDataFromArray(link_data, ['url'], ''));
                let link_url = HrefLinks(
                    extractDataFromArray(link_data, ["type"], ""),
                    extractDataFromArray(link_data, ["url"], "")
                );
                linkHtml = linkHtml.cleanReplace("___item_url___", link_url);

                let title = extractDataFromArray(link_data, ["title"], "");
                title = title.trim();

                title = empty(title) ?
                    extractDataFromArray(link_data, ["url"], "") :
                    title;
                linkHtml = linkHtml.cleanReplace("___item_title___", title);

                let icon_img = extractDataFromArray(link_data, ["icon_img"], "");
                // icon_img = empty(icon_img) ? extractDataFromArray(ComponentLists, ['social_link', 'socialLinks', extractDataFromArray(link_data, ['type'], ''), 'icon'], '') : icon_img;
                linkHtml = linkHtml.cleanReplace("___item_icon___", icon_img);

                return linkHtml;
            }

            let linkHtml = "";
            let links = extractDataFromArray(data, ["links"], []);
            links = empty(links) ? [{}] : links;
            links.forEach((item, index) => {
                if (!empty(item)) {
                    data["links"][index]["_id"] =
                        typeof data["links"][index]["_id"] == "undefined" ?
                        QRPageComponents.getUniqueId() :
                        data["links"][index]["_id"];
                    linkHtml += getLinkHtml(item, index);
                }
            });

            main = main.cleanReplace("___link_item___", linkHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "social_link",
            header_enable: 1,
            title: "Social Links",
            desc: "Description",
            links: [{
                    type: "facebook",
                    url: "",
                    title: "Facebook",
                    subtitle: "Follow us",
                    subtitle_enable: 1,
                    icon_img: "/images/digitalCard/fb_icon@72x.png",
                },
                {
                    type: "instagram",
                    url: "",
                    title: "Instagram",
                    subtitle: "Follow us",
                    subtitle_enable: 0,
                    icon_img: "/images/digitalCard/insta_icon@72x.png",
                },
            ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Card title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Card Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            extractDataFromArray(component, ["links"], []).forEach((link, index) => {
                let prefix = component_order + "Social Link:" + (index + 1);
                columns.push(prefix + ".type");
                samples.push(extractDataFromArray(link, ["type"], ""));

                columns.push(prefix + ".title");
                samples.push(extractDataFromArray(link, ["title"], ""));

                if (parseInt(extractDataFromArray(link, ["subtitle_enable"], 1))) {
                    columns.push(prefix + ".subtitle");
                    samples.push(extractDataFromArray(link, ["subtitle"], ""));
                }

                columns.push(prefix + ".icon_img");
                samples.push(extractDataFromArray(link, ["icon_img"], ""));

                columns.push(prefix + ".url");
                samples.push(extractDataFromArray(link, ["url"], ""));
            });
        },
    },
    pdf_gallery: {
        getPDFItem: function(data) {
            // console.log(optionsHtml)

            return (
                `<div class="list-group-item pdf_gallery_input_wrapper subcomponent_sortable_wrapper mb-4" data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `" >
            ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-social-link"><i class="icon-drag_1"></i></a>
                        </div>`) +
                `
                        <div class="my-2">PDF URL <span>(Please enter the PDF URL or upload)</span></div>
                        <div class="row">
                            <div class="col-md-9 pr-0">
                                <input type="text" class="form-control" name="url" value="` +
                data.url +
                `" placeholder="URL">
                            </div>
                            <div class="col-md-1 px-0 d-flex align-items-center justify-content-center">
                                <span style=" margin-bottom: 12px; ">or</span>
                            </div>
                            <div class="col-md-2 pl-0" >
                                <button class="upload_pdfs btn btn-primary  p-2" type="button"><i class="icon-file_upload_1 mr-1"></i>Upload</button>
                            </div>
                        </div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getImageUploader(
                    "PDF Thumbnail", [
                        extractDataFromArray(
                            data, ["icon_img"],
                            ComponentLists.pdf_gallery.default.pdfs[0].icon_img
                        ),
                    ],
                    "(250x250px, 1:1 Ratio)"
                ) +
                `
                        </div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getInputText("Title", "title", data.title, 6) +
                `
                            ` +
                QRPageComponentWrapper.getInputText(
                    "Subtitle",
                    "subtitle",
                    data.subtitle,
                    6,
                    "subtitle_enable",
                    data.subtitle_enable
                ) +
                `
                        </div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getDraggableLinkWrapper(data) {
                let pdfs = extractDataFromArray(data, ["pdfs"], []);
                let pdfsHtml = "";
                pdfs.forEach((pdf) => {
                    pdfsHtml += ComponentLists.pdf_gallery.getPDFItem(pdf);
                });
                return (
                    QRPageComponentWrapper.getTitleDescSection(
                        extractDataFromArray(data, ["title"], ""),
                        extractDataFromArray(data, ["desc"], ""),
                        parseInt(extractDataFromArray(data, ["header_enable"], 0))
                    ) +
                    `<div class="col-md-12 px-3">
                    <div class="row mx-0 list-group mt-3" id="pdf_gallery_container_` +
                    index +
                    `">
                        ` +
                    pdfsHtml +
                    `
                    </div>
                    ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        `
                    <div class="row mx-0 mt-2 btn_add_pdf_gallery" >
                        <button class="btn btn-outline-primary" ><i class="icon-add_1"></i>Add PDF</button>
                    </div>
                    `) +
                    `
                </div>`
                );
            }

            return getDraggableLinkWrapper(data);
        },
        title: "PDF Gallery",
        listeners: function(index) {
            new Sortable(document.getElementById("pdf_gallery_container_" + index), {
                handle: ".handle-social-link", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let pdfs = [];
            Array.from($(parent).find(".pdf_gallery_input_wrapper")).forEach(
                (ele) => {
                    let icon_img = $(ele)
                        .find(".img_uploaded_card.selected_img")
                        .css("background-image");
                    if (!empty(icon_img)) {
                        icon_img = icon_img.split('"')[1];
                    }
                    pdfs.push({
                        url: $(ele).find("input[name=url]").val(),
                        title: $(ele).find("input[name=title]").val(),
                        subtitle: $(ele).find("input[name=subtitle]").val(),
                        subtitle_enable: $(ele)
                            .find("input[name=subtitle_enable]")
                            .prop("checked") ?
                            1 :
                            0,
                        icon_img,
                        _id: $(ele).data("id"),
                    });
                }
            );
            return {
                ...header,
                pdfs,
            };
        },
        getPreviewHtml: function(data) {
            let pdfGalleryHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "pdf_gallery"
            );

            let main = pdfGalleryHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, pdfGalleryHtmlConfig);

            function getPDFHtml(pdf_data, index) {
                if (empty(pdf_data)) {
                    return '<li class="qr_cc_card no_data">' + headerHtml + "</li>";
                }
                let pdfHtml = pdfGalleryHtmlConfig.item;

                if (empty(extractDataFromArray(pdf_data, ["url"], ""))) {
                    return "";
                }

                pdfHtml = pdfHtml.cleanReplace("___header_html___", headerHtml);
                headerHtml = "";
                let subtitle = "";
                if (parseInt(extractDataFromArray(pdf_data, ["subtitle_enable"], 0))) {
                    subtitle = pdfGalleryHtmlConfig.subtitle.cleanReplace(
                        "___subtitle___",
                        extractDataFromArray(pdf_data, ["subtitle"], "")
                    );
                }
                pdfHtml = pdfHtml.cleanReplace("___item_subtitle___", subtitle);

                // let link_url = extractDataFromArray(pdf_data, ['type'], '') == 'email' ? 'mailto:'+extractDataFromArray(pdf_data, ['url'], '') : checkAndAdjustURL(extractDataFromArray(pdf_data, ['url'], ''));
                let link_url = HrefLinks(
                    extractDataFromArray(pdf_data, ["type"], ""),
                    extractDataFromArray(pdf_data, ["url"], "")
                );
                pdfHtml = pdfHtml.cleanReplace("___item_url___", link_url);

                let title = extractDataFromArray(pdf_data, ["title"], "");
                title = title.trim();

                title = empty(title) ?
                    extractDataFromArray(pdf_data, ["url"], "") :
                    title;
                pdfHtml = pdfHtml.cleanReplace("___item_title___", title);

                let icon_img = extractDataFromArray(pdf_data, ["icon_img"], "");
                icon_img = empty(icon_img) ?
                    extractDataFromArray(
                        ComponentLists, [
                            "social_link",
                            "socialLinks",
                            extractDataFromArray(pdf_data, ["type"], ""),
                            "icon",
                        ],
                        ""
                    ) :
                    icon_img;
                pdfHtml = pdfHtml.cleanReplace("___item_icon___", icon_img);

                return pdfHtml;
            }

            let pdfHtml = "";
            let pdfs = extractDataFromArray(data, ["pdfs"], []);
            pdfs = empty(pdfs) ? [{}] : pdfs;
            pdfs.forEach((item, index) => {
                if (!empty(item)) {
                    data["pdfs"][index]["_id"] =
                        typeof data["pdfs"][index]["_id"] == "undefined" ?
                        QRPageComponents.getUniqueId() :
                        data["pdfs"][index]["_id"];
                    pdfHtml += getPDFHtml(item, index);
                }
            });

            main = main.cleanReplace("___link_item___", pdfHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "pdf_gallery",
            header_enable: 1,
            title: "PDF Gallery",
            desc: "Description",
            pdfs: [{
                    url: "",
                    title: "PDF 1",
                    subtitle: "PDF Description",
                    subtitle_enable: 1,
                    icon_img: "/images/digitalCard/pdf_icon.png",
                },
                {
                    url: "",
                    title: "PDF 1",
                    subtitle: "PDF Description",
                    subtitle_enable: 1,
                    icon_img: "/images/digitalCard/pdf_icon.png",
                },
            ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Card title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Card Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            extractDataFromArray(component, ["links"], []).forEach((link, index) => {
                let prefix = component_order + "Social Link:" + (index + 1);
                columns.push(prefix + ".type");
                samples.push(extractDataFromArray(link, ["type"], ""));

                columns.push(prefix + ".title");
                samples.push(extractDataFromArray(link, ["title"], ""));

                if (parseInt(extractDataFromArray(link, ["subtitle_enable"], 1))) {
                    columns.push(prefix + ".subtitle");
                    samples.push(extractDataFromArray(link, ["subtitle"], ""));
                }

                columns.push(prefix + ".icon_img");
                samples.push(extractDataFromArray(link, ["icon_img"], ""));

                columns.push(prefix + ".url");
                samples.push(extractDataFromArray(link, ["url"], ""));
            });
        },
    },
    custom_fields: {
        getCustomFieldHtml: function(data) {
            return (
                `<div class="list-group-item custom_field_input_wrapper subcomponent_sortable_wrapper mb-4" data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `">
            ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-custom-field"><i class="icon-drag_1"></i></a>
                        </div>
                        `) +
                `
                        <div class=""></div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getInputText("", "key", data.key, 6) +
                `
                            ` +
                QRPageComponentWrapper.getInputText("", "val", data.val, 6) +
                `
                        </div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getCustomFields(data) {
                let fields = extractDataFromArray(data, ["fields"], []);
                let fieldsHtml = "";
                fields.forEach((field) => {
                    fieldsHtml += ComponentLists.custom_fields.getCustomFieldHtml(field);
                });
                return (
                    `<div class="col-md-12 px-3 ">
                        <div class="row mx-0 list-group mt-3" id="custom_field_container_` +
                    index +
                    `">
                                ` +
                    fieldsHtml +
                    `
                            </div>
                            ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        `
                            <div class="row mx-0 mt-2" >
                                <button class="btn btn-outline-primary btn_add_custom_field" ><i class="icon-add_1"></i>Add</button>
                            </div>
                            `) +
                    `
                        </div>`
                );
            }

            return (
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) + getCustomFields(data)
            );
        },
        title: "Other Details",
        listeners: function(index) {
            new Sortable(document.getElementById("custom_field_container_" + index), {
                handle: ".handle-custom-field", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let fields = [];
            Array.from($(parent).find(".custom_field_input_wrapper")).forEach(
                (ele) => {
                    fields.push({
                        key: $(ele).find("input[name=key]").val(),
                        val: $(ele).find("input[name=val]").val(),
                        _id: $(ele).data("id"),
                    });
                }
            );
            return {
                ...header,
                fields,
            };
        },
        getPreviewHtml: function(data) {
            let customFieldsHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "custom_fields"
            );

            let main = customFieldsHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, customFieldsHtmlConfig);

            function getLinkHtml(data, index) {
                let fieldHtml = customFieldsHtmlConfig.item;

                let key = extractDataFromArray(data, ["key"], "");
                let value = extractDataFromArray(data, ["val"], "");
                key = key.trim();
                value = value.trim();
                if (empty(key) && empty(value)) {
                    return "";
                }

                fieldHtml = fieldHtml.cleanReplace("___key___", key);
                return fieldHtml.cleanReplace("___val___", value);
            }

            let fieldsHtml = "";
            let fields = extractDataFromArray(data, ["fields"], []);
            data["fields"] = empty(fields) ? [{}] : fields;
            data["fields"].forEach((item, index) => {
                data["fields"][index]["_id"] =
                    typeof data["fields"][index]["_id"] == "undefined" ?
                    QRPageComponents.getUniqueId() :
                    data["fields"][index]["_id"];
                fieldsHtml += getLinkHtml(item, index);
            });

            if (empty(headerHtml) && empty(fieldsHtml)) {
                return "";
            }

            main = main.cleanReplace("___header_html___", headerHtml);
            main = main.cleanReplace("___field_items___", fieldsHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "custom_fields",
            header_enable: 1,
            title: "Other Information",
            desc: "",
            fields: [{
                key: "Key",
                val: "Value",
            }, ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Card title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Card Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            extractDataFromArray(component, ["fields"], []).forEach(
                (field, index) => {
                    let prefix = component_order + "Social Link:" + (index + 1);
                    columns.push(index + ".key");
                    samples.push(extractDataFromArray(field, ["key"], ""));

                    columns.push(index + ".val");
                    samples.push(extractDataFromArray(field, ["val"], ""));
                }
            );
        },
    },
    web_links: {
        getLinkItem: function(data) {
            return (
                `<div class="list-group-item web_link_input_wrapper subcomponent_sortable_wrapper mb-4"  data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `">
            ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-web-link"><i class="icon-drag_1"></i></a>
                        </div>`) +
                `
                        <div class=""></div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getInputText("Link", "url", data.url) +
                `
                        </div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getImageUploader(
                    "", [
                        extractDataFromArray(
                            data, ["icon_img"],
                            wrapperUrlWithCdn("/images/digitalCard/weblink.png")
                        ),
                    ],
                    "",
                    "1:1 Ratio"
                ) +
                `
                        </div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getInputText("Title", "title", data.title, 6) +
                `
                            ` +
                QRPageComponentWrapper.getInputText(
                    "Subtitle",
                    "subtitle",
                    data.subtitle,
                    6,
                    "subtitle_enable",
                    data.subtitle_enable
                ) +
                `
                        </div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getDraggableLinkWrapper(data) {
                let links = extractDataFromArray(data, ["links"], []);
                let linksHtml = "";
                links.forEach((link) => {
                    linksHtml += ComponentLists.web_links.getLinkItem(link);
                });
                return (
                    QRPageComponentWrapper.getTitleDescSection(
                        extractDataFromArray(data, ["title"], ""),
                        extractDataFromArray(data, ["desc"], ""),
                        parseInt(extractDataFromArray(data, ["header_enable"], 0))
                    ) +
                    `<div class="col-md-12 px-3 ">
                        <div class="row mx-0 list-group mt-3" id="web_link_container_` +
                    index +
                    `">
                                ` +
                    linksHtml +
                    `
                            </div>
                            ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        `
                            <div class="row mx-0 mt-2" >
                                <button class="btn btn-outline-primary btn_add_web_link" ><i class="icon-add_1"></i>Add Link</button>
                            </div>`) +
                    `
                        </div>`
                );
            }

            return getDraggableLinkWrapper(data);
        },
        title: "Links",
        listeners: function(index) {
            new Sortable(document.getElementById("web_link_container_" + index), {
                handle: ".handle-web-link", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let links = [];
            Array.from($(parent).find(".web_link_input_wrapper")).forEach((ele) => {
                let icon_img = $(ele)
                    .find(".img_uploaded_card.selected_img")
                    .css("background-image");
                if (!empty(icon_img)) {
                    icon_img = icon_img.split('"')[1];
                }
                links.push({
                    url: $(ele).find("input[name=url]").val(),
                    title: $(ele).find("input[name=title]").val(),
                    subtitle: $(ele).find("input[name=subtitle]").val(),
                    subtitle_enable: $(ele)
                        .find("input[name=subtitle_enable]")
                        .prop("checked") ?
                        1 :
                        0,
                    icon_img,
                    _id: $(ele).data("id"),
                });
            });
            return {
                ...header,
                links,
            };
        },
        getPreviewHtml: function(data) {
            let socialLinksHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "web_links"
            );

            let main = socialLinksHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, socialLinksHtmlConfig);

            function getLinkHtml(link_data, index) {
                if (empty(link_data)) {
                    return '<li class="qr_cc_card no_data">' + headerHtml + "</li>";
                }
                let linkHtml = socialLinksHtmlConfig.item;

                if (empty(extractDataFromArray(link_data, ["url"], ""))) {
                    return "";
                }

                linkHtml = linkHtml.cleanReplace("___header_html___", headerHtml);
                headerHtml = "";

                let subtitle = "";
                if (parseInt(extractDataFromArray(link_data, ["subtitle_enable"], 0))) {
                    subtitle = socialLinksHtmlConfig.subtitle.cleanReplace(
                        "___subtitle___",
                        extractDataFromArray(link_data, ["subtitle"], "")
                    );
                }

                let title = extractDataFromArray(link_data, ["title"], "");
                title = title.trim();

                title = empty(title) ?
                    extractDataFromArray(link_data, ["url"], "") :
                    title;

                linkHtml = linkHtml.cleanReplace("___item_subtitle___", subtitle);
                linkHtml = linkHtml.cleanReplace(
                    "___item_url___",
                    checkAndAdjustURL(extractDataFromArray(link_data, ["url"], ""))
                );
                linkHtml = linkHtml.cleanReplace("___item_title___", title);
                linkHtml = linkHtml.cleanReplace(
                    "___item_icon___",
                    extractDataFromArray(link_data, ["icon_img"], "")
                );

                return linkHtml;
            }

            let linkHtml = "";
            if (typeof data["links"] != "undefined") {
                let links = extractDataFromArray(data, ["links"], []);
                links = empty(links) ? [] : links;
                links.forEach((item, index) => {
                    if (typeof data["links"][index] == "undefined")
                        data["links"][index] = [];
                    data["links"][index]["_id"] =
                        typeof data["links"][index]["_id"] == "undefined" ?
                        QRPageComponents.getUniqueId() :
                        data["links"][index]["_id"];
                    linkHtml += getLinkHtml(item, index);
                });
            }
            main = main.cleanReplace("___link_item___", linkHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "web_links",
            header_enable: 1,
            title: "Web Link",
            desc: "Description",
            links: [{
                url: "",
                title: "Title",
                subtitle: "",
                subtitle_enable: 0,
                icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
            }, ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Card title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Card Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            extractDataFromArray(component, ["links"], []).forEach((link, index) => {
                let prefix = component_order + "Web Link:" + (index + 1);

                columns.push(prefix + ".title");
                samples.push(extractDataFromArray(link, ["title"], ""));

                if (parseInt(extractDataFromArray(link, ["subtitle_enable"], 1))) {
                    columns.push(prefix + ".subtitle");
                    samples.push(extractDataFromArray(link, ["subtitle"], ""));
                }

                columns.push(prefix + ".icon_img");
                samples.push(extractDataFromArray(link, ["icon_img"], ""));

                columns.push(prefix + ".url");
                samples.push(extractDataFromArray(link, ["url"], ""));
            });
        },
    },
    contact: {
        getContactInfoItem: function(data) {
            let contactInfoWrappers = {
                number: {
                    label: "Contact Number",
                    getHtml: function(data) {
                        // `+ QRPageComponentWrapper.getInputText("Title", "title", data.title) + `
                        return (
                            `<div class="row">
                               
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Label",
                                "title",
                                data.title,
                                6
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Number",
                                "number",
                                data.number,
                                6
                            ) +
                            `
                            </div>`
                        );
                    },
                },
                email: {
                    label: "Email",
                    getHtml: function(data) {
                        // `+ QRPageComponentWrapper.getInputText("Title", "title", data.title) + `
                        return (
                            `<div class="row">
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Label",
                                "title",
                                data.title,
                                6
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Email",
                                "email",
                                data.email,
                                6
                            ) +
                            `
                            </div>`
                        );
                    },
                },
                address: {
                    label: "Address",
                    getHtml: function(data) {
                        return (
                            `<div class="row">
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Label",
                                "title",
                                data.title
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Address Line 1",
                                "street",
                                extractDataFromArray(data, ["street"], ""),
                                6
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Address Line 2",
                                "building",
                                extractDataFromArray(data, ["building"], ""),
                                6
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "City",
                                "city",
                                extractDataFromArray(data, ["city"], ""),
                                6
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "State",
                                "state",
                                extractDataFromArray(data, ["state"], ""),
                                6
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Country",
                                "country",
                                extractDataFromArray(data, ["country"], ""),
                                6
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Zipcode",
                                "zip",
                                extractDataFromArray(data, ["zip"], ""),
                                6
                            ) +
                            `
                                ` +
                            QRPageComponentWrapper.getInputText(
                                "Action Button",
                                "action_button_label",
                                data.action_button_label,
                                6,
                                "action_button_enable",
                                data.action_button_enable
                            ) +
                            QRPageComponentWrapper.getInputText(
                                "Google Map URL",
                                "action_button_link",
                                extractDataFromArray(data, ["action_button_link"], ""),
                                6
                            ) +
                            `
                            </div>`
                        );
                    },
                },
            };
            if (empty(data.type)) {
                return;
            }
            let inputHtml = contactInfoWrappers[data.type].getHtml(data);

            return (
                `<div class="list-group-item contact_info_input_wrapper subcomponent_sortable_wrapper mb-5" data-type="` +
                data.type +
                `"  data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `">
                        <div class="contact_info_input_title">
                            ` +
                contactInfoWrappers[data.type].label +
                `
                        </div>
                        ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-contact_info"><i class="icon-drag_1"></i></a>
                        </div> `) +
                `
                        ` +
                inputHtml +
                `
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getFloatingButtonWrapperHtml(data) {
                return (
                    `<div class="col-md-12 px-3 mt-2">
                ` +
                    (QRPageComponents.isBulkUploadQRCode() &&
                        empty(extractDataFromArray(data, ["floating_button_enable"], 0)) ?
                        "" :
                        `
                            <div class="row mx-0">
                                <div class="mr-2 mb-2" > Floating button </div>` +
                        QRPageComponentWrapper.getSwitcheryButton(
                            "floating_button_enable",
                            extractDataFromArray(data, ["floating_button_enable"], 0)
                        ) +
                        `
                            </div>
                          
                            <div class="row mx-0 gray_card align-items-center" >
                                ` +
                        QRPageComponentWrapper.getInputText(
                            "Button Text",
                            "floating_button_label",
                            extractDataFromArray(data, ["floating_button_label"], ""),
                            6
                        ) +
                        `
                                <div class="col-md-6 d-flex justify-content-end">
                                    <button class="btn bg-light floating_contact_button" type="button">
                                        <span class="floating_contact_button_text">` +
                        extractDataFromArray(data, ["floating_button_label"], "") +
                        `</span>
                                        <span class="add_contact_icon"><i class="icon-add_1"></i></span>
                                    </button>
                                </div>
                            </div> `) +
                    `
                        </div>`
                );
            }

            function getDraggableContactsWrapper(data) {
                let contact_infos = extractDataFromArray(data, ["contact_infos"], []);
                let contactHtml = "";
                contact_infos.forEach((contact) => {
                    contactHtml += ComponentLists.contact.getContactInfoItem(contact);
                });
                return (
                    `<div class="col-md-12 px-3 mt-2">
                            <div class="row mx-0 list-group mt-5" id="contact_info_container_` +
                    index +
                    `">
                                ` +
                    contactHtml +
                    `
                            </div>
                            <div class="row mx-0 mt-2" >
                                <div class="dropup">
                                ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        `
                                    <button class="btn btn-outline-primary dropdown-toggle" type="button" id="btn_add_contact_component" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="icon-add_1"></i>Add
                                    </button>
                                    `) +
                    `
                                    <div class="dropdown-menu add_contact_component" aria-labelledby="btn_add_contact_component">
                                        <a class="dropdown-item" href="" data-type="number">Number</a>
                                        <a class="dropdown-item" href="" data-type="email">Email</a>
                                        <a class="dropdown-item" href="" data-type="address">Address</a>
                                    </div>
                                </div>
                            </div>
                        </div>`
                );
            }

            return (
                QRPageComponentWrapper.getInputText(
                    "Title",
                    "contact_title",
                    extractDataFromArray(data, ["contact_title"], "")
                ) +
                QRPageComponentWrapper.getImageUploader(
                    "", [
                        extractDataFromArray(
                            data, ["icon_img"],
                            "/images/digitalCard/contactus.png"
                        ),
                    ],
                    "1:1 Ratio"
                ) +
                getFloatingButtonWrapperHtml(data) +
                getDraggableContactsWrapper(data)
            );
        },
        title: "Contact Us",
        listeners: function(index) {
            new Sortable(document.getElementById("contact_info_container_" + index), {
                handle: ".handle-contact_info", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        getInputData: function(index, parent) {
            let icon_img = $(parent)
                .find(".img_uploaded_card.selected_img")
                .css("background-image");
            if (!empty(icon_img)) {
                icon_img = icon_img.split('"')[1];
            }
            if (icon_img == location.href) {
                icon_img = "";
            }
            let contact_infos = [];
            Array.from($(parent).find(".contact_info_input_wrapper")).forEach(
                (ele) => {
                    let contact_data = {
                        type: $(ele).data("type"),
                        title: $(ele).find("input[name=title]").val(),
                        _id: $(ele).data("id"),
                    };

                    if (contact_data.type == "number") {
                        contact_data["label"] = $(ele).find("input[name=label]").val();
                        contact_data["number"] = $(ele).find("input[name=number]").val();
                    } else if (contact_data.type == "email") {
                        contact_data["label"] = $(ele).find("input[name=label]").val();
                        contact_data["email"] = $(ele).find("input[name=email]").val();
                    } else if (contact_data.type == "address") {
                        contact_data["street"] = $(ele).find("input[name=street]").val();
                        contact_data["building"] = $(ele)
                            .find("input[name=building]")
                            .val();
                        contact_data["city"] = $(ele).find("input[name=city]").val();
                        contact_data["state"] = $(ele).find("input[name=state]").val();
                        contact_data["country"] = $(ele).find("input[name=country]").val();
                        contact_data["zip"] = $(ele).find("input[name=zip]").val();
                        // contact_data['address'] = $(ele).find("textarea[name=address]").val();
                        contact_data["action_button_label"] = $(ele)
                            .find("input[name=action_button_label]")
                            .val();
                        contact_data["action_button_link"] = $(ele)
                            .find("input[name=action_button_link]")
                            .val();
                        contact_data["action_button_enable"] = $(ele)
                            .find("input[name=action_button_enable]")
                            .prop("checked") ?
                            1 :
                            0;
                    }

                    contact_infos.push(contact_data);
                }
            );
            return {
                contact_title: $(parent).find("input[name=contact_title]").val(),
                icon_img,
                floating_button_enable: $(parent)
                    .find("input[name=floating_button_enable]")
                    .prop("checked") ?
                    1 :
                    0,
                floating_button_label: $(parent)
                    .find("input[name=floating_button_label]")
                    .val(),
                contact_infos,
            };
        },
        getPreviewHtml: function(data) {
            QRPageComponents._contact_button_html = "";
            let contactHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "contact"
            );
            let contact_title = extractEscapeHtmlDataFromArray2(
                data, ["contact_title"],
                ""
            );
            let contact_icon_img = extractDataFromArray(data, ["icon_img"], "");
            contact_title = contact_title.trim();

            let contact_header_html = "";
            if (!(empty(contact_title) && empty(contact_icon_img))) {
                contact_header_html = extractDataFromArray(
                    contactHtmlConfig, ["contact_header", "main"],
                    ""
                );

                contact_header_html = contact_header_html.cleanReplace(
                    "___title_html___",
                    extractDataFromArray(
                        contactHtmlConfig, ["contact_header", "title"],
                        ""
                    ).cleanReplace("___title___", contact_title)
                );

                contact_header_html = contact_header_html.cleanReplace(
                    "___icon_img_html___",
                    extractDataFromArray(
                        contactHtmlConfig, ["contact_header", "icon_img"],
                        ""
                    ).cleanReplace("___icon_img___", contact_icon_img)
                );
            }

            let main = contactHtmlConfig.main;

            let contactInfoHtml = "";
            extractDataFromArray(data, ["contact_infos"], []).forEach(
                (item, index) => {
                    data["contact_infos"][index]["_id"] =
                        typeof data["contact_infos"][index]["_id"] == "undefined" ?
                        QRPageComponents.getUniqueId() :
                        data["contact_infos"][index]["_id"];
                    let itemHtml = "";
                    let itemTitle = extractDataFromArray(item, ["title"], "");
                    itemTitle = itemTitle.trim();
                    if (item.type == "number") {
                        let number = extractDataFromArray(item, ["number"], "");
                        number = number.trim();
                        if (empty(itemTitle) && empty(number)) {
                            return "";
                        }
                        itemHtml = contactHtmlConfig.number.cleanReplace(
                            "___title___",
                            itemTitle
                        );
                        itemHtml = itemHtml.cleanReplace("___number___", number);
                        itemHtml = itemHtml.cleanReplace("___number___", number);
                    } else if (item.type == "email") {
                        let email = extractDataFromArray(item, ["email"], "");
                        email = email.trim();
                        if (empty(itemTitle) && empty(email)) {
                            return "";
                        }

                        itemHtml = contactHtmlConfig.email.cleanReplace(
                            "___title___",
                            itemTitle
                        );
                        itemHtml = itemHtml.cleanReplace("___email___", email);
                        itemHtml = itemHtml.cleanReplace("___email___", email);
                    } else if (item.type == "address") {
                        let actionButton = "";
                        if (!empty(item.action_button_enable)) {
                            let actionButtonLabel = extractDataFromArray(
                                item, ["action_button_label"],
                                ""
                            );
                            actionButtonLabel = actionButtonLabel.trim();
                            if (!empty(actionButtonLabel)) {
                                actionButton =
                                    contactHtmlConfig.address.action_button.cleanReplace(
                                        "___btn_link___",
                                        checkAndAdjustURL(
                                            extractDataFromArray(item, ["action_button_link"], "")
                                        )
                                    );
                                actionButton = actionButton.cleanReplace(
                                    "___btn_label___",
                                    actionButtonLabel
                                );
                            }
                        }

                        itemHtml = contactHtmlConfig.address.main.cleanReplace(
                            "___title___",
                            itemTitle
                        );

                        /* Address Format
                                Address Line 1
                                Address Line 2
                                City, State, Zip Code
                                Country
                                */

                        let street = extractDataFromArray(item, ["street"], "");
                        let building = extractDataFromArray(item, ["building"], "");
                        let city = extractDataFromArray(item, ["city"], "");
                        let state = extractDataFromArray(item, ["state"], "");
                        let zip = extractDataFromArray(item, ["zip"], "");
                        let country = extractDataFromArray(item, ["country"], "");

                        let address = "";

                        if (street != "") address += street + "<br>";

                        if (building != "") address += building + "<br>";

                        let ctStZp = "";

                        if (city != "") ctStZp += city + ", ";

                        if (state != "") ctStZp += state + ", ";

                        if (zip != "") ctStZp += zip;

                        if (ctStZp.endsWith(", ")) ctStZp = ctStZp.slice(0, -2);

                        if (ctStZp != "") address += ctStZp + "<br>";

                        if (country != "") address += country;

                        if (address.endsWith("<br>")) address = address.slice(0, -4);

                        if (empty(itemTitle) && empty(address) && empty(actionButton)) {
                            return "";
                        }

                        itemHtml = itemHtml.cleanReplace("___address___", address);
                        itemHtml = itemHtml.cleanReplace(
                            "___action_button___",
                            actionButton
                        );
                    }
                    contactInfoHtml += itemHtml;
                }
            );
            let floating_button = "";
            let floating_button_label = extractDataFromArray(
                data, ["floating_button_label"],
                ""
            );
            if (
                parseInt(extractDataFromArray(data, ["floating_button_enable"], 0)) &&
                !empty(floating_button_label)
            ) {
                QRPageComponents._contact_button_html =
                    contactHtmlConfig.floating_button.cleanReplace(
                        "___label___",
                        floating_button_label
                    );
            }

            if (empty(contactInfoHtml) && empty(contact_header_html)) {
                if (!empty(floating_button)) {
                    return floating_button;
                }
                return "";
            }

            main = main.cleanReplace(
                "___contact_header_html___",
                contact_header_html
            );
            main = main.cleanReplace("___contact_info_html___", contactInfoHtml);
            main = main.cleanReplace("___floating_btn___", floating_button);
            // main = main.cleanReplace('___link_item___', linkHtml)
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "contact",
            contact_title: "Contact Us",
            icon_img: "/images/digitalCard/contactus.png",
            floating_button_enable: 1,
            floating_button_label: "Add to Contact",
            contact_infos: [{
                type: "number",
                title: "Call Us",
                label: "Mobile ",
                number: "123 456 7890",
            }, ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";
            columns.push(component_order + "Contact Title");
            samples.push(extractDataFromArray(component, ["contact_title"], ""));

            columns.push(component_order + "Contact Icon");
            samples.push(extractDataFromArray(component, ["icon_img"], ""));

            // columns.push(component_order + "Show Floating Button")
            // samples.push(extractDataFromArray(component, ['floating_button_enable'], 1) ? 'Y' : 'N')
            if (
                parseInt(extractDataFromArray(component, ["floating_button_enable"], 1))
            ) {
                columns.push(component_order + "Floating Button Text");
                samples.push(
                    extractDataFromArray(
                        component, ["floating_button_label"],
                        "Add to Contact"
                    )
                );
            }

            extractDataFromArray(component, ["contact_infos"], []).forEach(
                (contact_info, index) => {
                    let column_prefix =
                        component_order + "Contact Info:" + (index + 1) + ".";

                    columns.push(column_prefix + "type");
                    samples.push(extractDataFromArray(contact_info, ["type"], ""));

                    columns.push(column_prefix + "title");
                    samples.push(extractDataFromArray(contact_info, ["title"], ""));

                    if (contact_info.type == "number") {
                        columns.push(column_prefix + "Number");
                        samples.push(extractDataFromArray(contact_info, ["number"], ""));
                    } else if (contact_info.type == "email") {
                        columns.push(column_prefix + "Email");
                        samples.push(extractDataFromArray(contact_info, ["email"], ""));
                    } else if (contact_info.type == "address") {
                        columns.push(column_prefix + "Street1");
                        samples.push(extractDataFromArray(contact_info, ["street"], ""));

                        columns.push(column_prefix + "Street2");
                        samples.push(extractDataFromArray(contact_info, ["building"], ""));

                        columns.push(column_prefix + "City");
                        samples.push(extractDataFromArray(contact_info, ["city"], ""));

                        columns.push(column_prefix + "State");
                        samples.push(extractDataFromArray(contact_info, ["state"], ""));

                        columns.push(column_prefix + "Country");
                        samples.push(extractDataFromArray(contact_info, ["country"], ""));

                        columns.push(column_prefix + "Zipcode");
                        samples.push(extractDataFromArray(contact_info, ["zipcode"], ""));

                        // columns.push(component_order + "Action Button")
                        // samples.push(extractDataFromArray(component, ['action_button_enable'], 1) ? 'Y' : 'N')

                        if (
                            parseInt(
                                extractDataFromArray(component, ["action_button_enable"], 1)
                            )
                        ) {
                            columns.push(column_prefix + "Action Button Label");
                            samples.push(
                                extractDataFromArray(contact_info, ["action_button_label"], "")
                            );

                            columns.push(column_prefix + "Action Button Link");
                            samples.push(
                                extractDataFromArray(contact_info, ["action_button_link"], "")
                            );
                        }
                    }
                }
            );
        },
    },
    text_desc: {
        getInputWrapperHtml: function(data) {
            //console.log(data);
            return (
                QRPageComponentWrapper.getInputText(
                    "Title",
                    "title",
                    extractDataFromArray(data, ["title"], "")
                ) +
                QRPageComponentWrapper.getTextAreaInput(
                    "Description",
                    "desc",
                    extractDataFromArray(data, ["desc"], "")
                )
            );
        },
        title: "Heading + Text",
        getInputData: function(index, parent) {
            return {
                title: $(parent).find("input[name=title]").val(),
                desc: $(parent).find("textarea[name=desc]").val(),
            };
        },
        getPreviewHtml: function(data) {
            let textHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "text_desc"
            );

            //title
            let title = extractEscapeHtmlDataFromArray2(data, ["title"], "");
            let titleHtml = "";
            if (!empty(title.trim())) {
                titleHtml = extractDataFromArray(textHtmlConfig, ["title"], "");
                titleHtml = titleHtml.cleanReplace("___title___", title);
            }

            //desc
            let desc = extractEscapeHtmlDataFromArray2(data, ["desc"], "");
            let descHtml = "";
            if (!empty(desc.trim())) {
                descHtml = extractDataFromArray(textHtmlConfig, ["desc"], "");
                descHtml = descHtml.cleanReplace("___desc___", desc);
            }

            if (empty(titleHtml) && empty(descHtml)) {
                return "";
            }

            let main = textHtmlConfig.main.cleanReplace(
                "___title_html___",
                titleHtml
            );
            main = main.cleanReplace(/qr_cc_card/g, getCardClass(data));
            main = main.cleanReplace("___desc_html___", descHtml);
            return nl2br(main);
        },
        default: {
            component: "text_desc",
            title: "Heading",
            desc: "Description",
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_label = component_index + ".Heading+Text";

            columns.push(component_label + ".Heading");
            samples.push(extractDataFromArray(component, ["title"], ""));

            columns.push(component_label + ".Description");
            samples.push(extractDataFromArray(component, ["desc"], ""));
        },
    },
    coupon_code: {
        getUploadAndDragStep: function() {
            return `
            <div class="d-flex align-items-center" id="coupon-code-upload">
                <div class=" qr_file_upload mr-2">
                    <i class="icon-uploadfile"></i>
                </div>
                <div class="">Upload Coupon File</div>
            </div>
            <input type="file" class="d-none" id="coupon-code-upload-input" accept=".csv,.tsv,.xls,.xlsx,.ods">
            <div class="text-muted mt-2 mb-3">Please upload the CSV, XLS or XLSX file</div>`;
        },
        getUploadStepsWrapper: function() {
            return (
                `<div class="coupon-code-upload-wrapper col-md-12 text-left">
                        <div class="row">
                            <div class="col-md-3  py-3 border-top mt-4">Step 1 <span class="ml-2 tippy"><i class="icon-help help-popup" help-id="coupon-code-step-1"></i></span></div>
                            <div class="col-md-9  py-3 border-top mt-4">
                                <a class="btn btn-link p-0 mb-2" href="/user/services/openapi?cmd=getCouponSampleRec" >Download Sample File</a>
                            </div>
                            <div class="col-md-3 border-top py-3">Step 2
                                <span class="ml-2 tippy"><i class="icon-help help-popup" help-id="coupon-code-step-2"></i></span>
                            </div>
                            <div class="col-md-9 border-top py-3">
                                <div class="mb-2">Upload (Only alpha-numeric coupon codes are allowed.)</div>
                               ` +
                ComponentLists.coupon_code.getUploadAndDragStep() +
                `
                            </div>
                        </div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data) {
            //console.log(data);
            let bulk_upload_html =
                ComponentLists.coupon_code.getUploadStepsWrapper() +
                `
            <div class="coupon-code-uploaded-file-wrapper col-md-12" style="display:none;">
                <div class="row">
                    <span class="file_name">asdfa</span>
                    <span class="remove_file_btn"><i class="icon-ic_add"></i></span>
                </div>
            </div>`;
            if ($("[name=id]").val() != "new") {
                bulk_upload_html = `
                <div class="col-md-12">
                    You can upload new coupon codes or edit existing codes from dashboard.
                </div>
                <div class="col-md-12 mt-2">
                    <img src="/images/coupon_code_edit_image.png" class="w-100">
                </div>`;
            }
            return (
                QRPageComponentWrapper.getInputText(
                    "Heading",
                    "title",
                    extractDataFromArray(data, ["title"], "")
                ) + bulk_upload_html
            );
        },
        listeners: function() {
            CouponCodeHandler.init();
        },
        title: "Coupon Codes",
        getInputData: function(index, parent) {
            return {
                title: $(parent).find("input[name=title]").val(),
                desc: $(parent).find("textarea[name=desc]").val(),
            };
        },
        getPreviewHtml: function(data) {
            let textHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "coupon_code"
            );
            let main = textHtmlConfig.main.cleanReplace(
                "___title___",
                extractDataFromArray(data, ["title"], "")
            );
            let coupon_code = "XXXXXX";
            if (typeof _coupon_code != "undefined") {
                coupon_code = _coupon_code;
            }
            if (empty(coupon_code) && page == "displayPage") {
                return ` <div class="section qrc_coupon_code qr_cc_card"><p class="no_coupon">Sorry, Coupon Codes are not available at the moment. Please revisit again in some time.</p></div>`;
            }
            main = main.cleanReplace("___coupon_code___", coupon_code);
            main = main.cleanReplace(/qr_cc_card/g, getCardClass(data));
            return main;
        },
        default: {
            component: "text_desc",
            title: "Heading",
            desc: "Description",
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_label = component_index + ".Heading+Text";

            columns.push(component_label + ".Heading");
            samples.push(extractDataFromArray(component, ["title"], ""));

            columns.push(component_label + ".Description");
            samples.push(extractDataFromArray(component, ["desc"], ""));
        },
    },
    images: {
        getInputWrapperHtml: function(data, index) {
            function getViewTypeHtml(selected_type) {
                let viewTypes = {
                    // slider: {
                    //     img_name: 'slider.png',
                    //     label: 'Slider'
                    // },
                    list: {
                        img_name: "list.png",
                        label: "List",
                    },
                    grid_1: {
                        img_name: "grid.png",
                        label: "Grid 1",
                    },
                    grid_2: {
                        img_name: "grid_2.png",
                        label: "Grid 2",
                    },
                };
                let viewTypeHtml = "";
                Object.keys(viewTypes).forEach((view_type) => {
                    viewTypeHtml +=
                        `<div class="image_view_type_item">
                                        <div class="image_view_type_card ` +
                        (selected_type == view_type ? "selected" : "") +
                        `" data-type="` +
                        view_type +
                        `">
                                            <img src="` +
                        wrapperUrlWithCdn(
                            `/assets/images/` + viewTypes[view_type].img_name
                        ) +
                        `" width=36 height=36 class="img-fluid">
                                        </div>
                                        <div class="text-center mt-1">` +
                        viewTypes[view_type].label +
                        `</div>
                                    </div>`;
                });
                let show_note =
                    $("#bulk_upload_switch").length == 0 ?
                    getUrlParameterByName("bulk") :
                    $("#bulk_upload_switch").prop("checked");
                let note =
                    '<span class="font-12 text-muted bulk_notes" style="' +
                    (show_note ? "" : "display:none;") +
                    '">(Note: The view type set in the uploaded excel file will overwrite this selection)</span>';
                return (
                    `<div class="col-md-12 mb-2">
                            <div class="row mx-0">
                                <div class="mr-2 mb-2" > View Type ` +
                    note +
                    ` </div>
                            </div>
                            <div class="row mx-0 d-flex image_view_type_wrapper">
                                ` +
                    viewTypeHtml +
                    `
                            </div>
                        </div>`
                );
            }
            return (
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) +
                getViewTypeHtml(extractDataFromArray(data, ["view_type"], "slider")) +
                QRPageComponentWrapper.getImagesUploader(
                    "Photos",
                    extractDataFromArray(data, ["images"], []),
                    index
                )
            );
        },
        title: "Images",
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let images = [];
            Array.from(
                $(parent).find(
                    ".img_upload_card_wrapper .img_uploaded_card.multiple_img"
                )
            ).forEach((ele) => {
                let icon_img = $(ele).css("background-image");
                if (!empty(icon_img)) {
                    icon_img = icon_img.split('"')[1];
                    if (icon_img.indexOf("qr-code-generator-for-") == -1) {
                        images.push(icon_img);
                    }
                }
            });
            return {
                ...header,
                view_type: $(parent)
                    .find(".image_view_type_card.selected")
                    .data("type"),
                images,
            };
        },
        getPreviewHtml: function(data, index) {
            let imagesHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "images"
            );

            let main = imagesHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, imagesHtmlConfig);

            let images = extractDataFromArray(data, ["images"], []);
            let imagesHTML = "";
            if (typeof images == "string") {
                images = images.split(",");
            }
            let imageItemHtml = extractDataFromArray(imagesHtmlConfig, ["image"], "");
            images.forEach((item) => {
                item = item.trim();
                if (empty(item)) {
                    return;
                }

                if (item.indexOf("qr-code-generator-for-") != -1) {
                    return;
                }

                imagesHTML += imageItemHtml.cleanReplace("___img_src___", item, true);
            });

            if (empty(headerHtml) && empty(imagesHTML)) {
                return "";
            }

            main = main.cleanReplace("___header_html___", headerHtml);
            let imageContainer = "";
            if (!empty(imagesHTML)) {
                imageContainer = extractDataFromArray(
                    imagesHtmlConfig, ["image_container"],
                    ""
                );
                imageContainer = imageContainer.cleanReplace(
                    "___images___",
                    imagesHTML
                );
                let view_type = extractDataFromArray(data, ["view_type"], "");
                if (empty(view_type.trim())) {
                    view_type = "list";
                    if (
                        typeof _parent_bulk_content != "undefined" &&
                        !empty(_parent_bulk_content)
                    ) {
                        view_type = extractDataFromArray(
                            _parent_bulk_content, [index, "view_type"],
                            "list"
                        );
                    }
                }
                imageContainer = imageContainer.cleanReplace(
                    "___view_type___",
                    "qrc_gallery_" + (empty(view_type) ? "list" : view_type)
                );
            }
            main = main.cleanReplace("___images_html___", imageContainer);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        listeners: function(index) {
            new Sortable(document.getElementById("images_grid_" + index), {
                handle: ".handle-img", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        default: {
            component: "images",
            title: "Heading",
            header_enable: 0,
            desc: "Description",
            view_type: "grid_2",
            images: [
                "/images/digitalCard/image_1.png",
                "/images/digitalCard/image_2.png",
            ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Image.Title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Image.Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            columns.push(component_order + "Image.View type");
            samples.push(extractDataFromArray(component, ["view_type"], "list"));

            columns.push(component_order + "Images");
            let images = extractDataFromArray(
                component, ["images"], ["image url"]
            ).join(",");
            // extractDataFromArray(component, ['images'], ['image url']).forEach((image, index) => {
            //     images+=image
            // })
            samples.push(images);
        },
    },
    image_gallery: {
        getInputWrapperHtml: function(data, index) {
            function getViewTypeHtml(selected_type) {
                let viewTypes = {
                    slider: {
                        img_name: 'slider.png',
                        label: 'Slider'
                    },
                    list: {
                        img_name: "list.png",
                        label: "List",
                    },
                    grid_1: {
                        img_name: "grid.png",
                        label: "Grid 1",
                    },
                    grid_2: {
                        img_name: "grid_2.png",
                        label: "Grid 2",
                    },
                };
                let viewTypeHtml = "";
                Object.keys(viewTypes).forEach((view_type) => {
                    viewTypeHtml +=
                        `<div class="image_view_type_item">
                                        <div class="image_gallery_view_type_card ` +
                        (selected_type == view_type ? "selected" : "") +
                        `" data-type="` +
                        view_type +
                        `">
                                            <img src="` +
                        wrapperUrlWithCdn(
                            `/assets/images/` + viewTypes[view_type].img_name
                        ) +
                        `" width=36 height=36 class="img-fluid">
                                        </div>
                                        <div class="text-center mt-1">` +
                        viewTypes[view_type].label +
                        `</div>
                                    </div>`;
                });
                let show_note =
                    $("#bulk_upload_switch").length == 0 ?
                    getUrlParameterByName("bulk") :
                    $("#bulk_upload_switch").prop("checked");
                let note =
                    '<span class="font-12 text-muted bulk_notes" style="' +
                    (show_note ? "" : "display:none;") +
                    '">(Note: The view type set in the uploaded excel file will overwrite this selection)</span>';
                return (
                    `<div class="col-md-12 mb-2">
                            <div class="row mx-0">
                                <div class="mr-2 mb-2" > View Type ` +
                    note +
                    ` </div>
                            </div>
                            <div class="row mx-0 d-flex image_view_type_wrapper">
                                ` +
                    viewTypeHtml +
                    `
                            </div>
                        </div>`
                );
            }
            return (
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) +
                getViewTypeHtml(extractDataFromArray(data, ["view_type"], "slider")) +
                QRPageComponentWrapper.getImageGalleryUploader(
                    "Photos",
                    extractDataFromArray(data, ["images"], []),
                    index,
                    extractDataFromArray(data, ["view_type"], "slider")
                )
            );
        },
        title: "Images + Links",
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let images = [];
            Array.from(
                $(parent).find(
                    ".img_upload_card_wrapper .img_data_div"
                )
            ).forEach((ele) => {
                let icon_img = $(ele).find('.img_uploaded_card.multiple_img').css("background-image");
                let image_data = {
                    image: '',
                    title: $(ele).find("input[name=title]").val(),
                    link: $(ele).find("input[name=link]").val()
                }
                if (!empty(icon_img)) {
                    icon_img = icon_img.split('"')[1];
                    if (icon_img.indexOf("qr-code-generator-for-") == -1) {
                        image_data['image'] = icon_img;
                        images.push(image_data);
                    }
                }
            });
            return {
                ...header,
                view_type: $(parent)
                    .find(".image_gallery_view_type_card.selected")
                    .data("type"),
                images,
            };
        },
        getPreviewHtml: function(data, index) {
            let imagesHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "image_gallery"
            );

            let main = imagesHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, imagesHtmlConfig);

            let images = extractDataFromArray(data, ["images"], []);
            let imagesHTML = "";
            if (typeof images == "string") {
                images = images.split(",");
            }
            let imageItemHtml = extractDataFromArray(imagesHtmlConfig, ["image"], "");

            if (extractDataFromArray(data, ["view_type"], "") == 'slider') {
                imageItemHtml = extractDataFromArray(imagesHtmlConfig, ["slide_html"], "");
            }

            images = validateSelectedImages(images);
            images.forEach((item) => {
                let modifiedImageItemHtml = imageItemHtml;

                let link_url = HrefLinks(
                    extractDataFromArray(item, ["type"], ""),
                    extractDataFromArray(item, ["link"], "")
                );
                if (empty(link_url)) {
                    link_url = '#'
                }
                modifiedImageItemHtml = modifiedImageItemHtml.cleanReplace("___image_link___", link_url);

                modifiedImageItemHtml = modifiedImageItemHtml.cleanReplace("___image_title___", extractDataFromArray(item, ["title"], ""));


                item = item['image'].trim();
                if (empty(item)) {
                    return;
                }

                if (item.indexOf("qr-code-generator-for-") != -1) {
                    return;
                }


                imagesHTML += modifiedImageItemHtml.cleanReplace("___img_src___", item, true);
            });

            if (empty(headerHtml) && empty(imagesHTML)) {
                return "";
            }

            main = main.cleanReplace("___header_html___", headerHtml);
            let imageContainer = "";
            if (!empty(imagesHTML)) {
                imageContainer = extractDataFromArray(
                    imagesHtmlConfig, ["image_container"],
                    ""
                );
                imageContainer = imageContainer.cleanReplace(
                    "___images___",
                    imagesHTML
                );
                let view_type = extractDataFromArray(data, ["view_type"], "");
                if (empty(view_type.trim())) {
                    view_type = "list";
                    if (
                        typeof _parent_bulk_content != "undefined" &&
                        !empty(_parent_bulk_content)
                    ) {
                        view_type = extractDataFromArray(
                            _parent_bulk_content, [index, "view_type"],
                            "list"
                        );
                    }
                }
                imageContainer = imageContainer.cleanReplace(
                    "___view_type___",
                    "qrc_gallery_" + (empty(view_type) ? "list" : view_type)
                );
            }

            if (extractDataFromArray(data, ["view_type"], "") == 'slider') {
                let modifiedSliderItemHtml = imagesHtmlConfig.slider;
                modifiedSliderItemHtml = modifiedSliderItemHtml.cleanReplace("___slide_html___", imagesHTML)
                main = main.cleanReplace("___images_html___", modifiedSliderItemHtml);
            } else {
                main = main.cleanReplace("___images_html___", imageContainer);
            }

            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        listeners: function(index) {
            new Sortable(document.getElementById("images_grid_" + index), {
                handle: ".handle-img", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        default: {
            component: "image_gallery",
            title: "Heading",
            header_enable: 0,
            desc: "Description",
            view_type: "slider",
            images: [{
                    image: "/images/digitalCard/image_1.png",
                    title: "",
                    link: ""
                },
                {
                    image: "/images/digitalCard/image_2.png",
                    title: "",
                    link: ""
                },
                {
                    image: "/images/digitalCard/image_1.png",
                    title: "",
                    link: ""
                }
            ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Image.Title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Image.Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            columns.push(component_order + "Image.View type");
            samples.push(extractDataFromArray(component, ["view_type"], "list"));

            columns.push(component_order + "Images+Links");
            samples.push('');

        },
    },
    button: {
        getInputWrapperHtml: function(data) {
            return (
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) +
                QRPageComponentWrapper.getInputText(
                    "Button Label",
                    "button_label",
                    extractDataFromArray(data, ["button_label"], "")
                ) +
                QRPageComponentWrapper.getInputText(
                    "Button Link",
                    "button_link",
                    extractDataFromArray(data, ["button_link"], "")
                )
            );
        },
        title: "Button",
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            return {
                ...header,
                button_label: $(parent).find("input[name=button_label]").val(),
                button_link: $(parent).find("input[name=button_link]").val(),
            };
        },
        getPreviewHtml: function(data) {
            let buttonHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "button"
            );

            // get header
            let headerHtml = getComponentHeaderHtml(data, buttonHtmlConfig);

            // get button
            let buttonHtml = "";
            let buttonLabel = extractDataFromArray(data, ["button_label"], "");
            buttonLabel = buttonLabel.trim();
            if (!empty(buttonLabel)) {
                buttonHtml = extractDataFromArray(buttonHtmlConfig, ["button"], "");
                buttonHtml = buttonHtml.cleanReplace("___btn_label___", buttonLabel);
                buttonHtml = buttonHtml.cleanReplace(
                    "___btn_link___",
                    checkAndAdjustURL(extractDataFromArray(data, ["button_link"], ""))
                );
            }

            if (empty(headerHtml) && empty(buttonHtml)) {
                return "";
            }

            let main = buttonHtmlConfig.main;
            main = main.cleanReplace("___header_html___", headerHtml);
            main = main.cleanReplace("___button_html___", buttonHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "button",
            header_enable: 1,
            title: "Button",
            desc: "Description",
            button_label: "Visit my site",
            button_link: "",
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_label = component_index + ".Button.";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_label + "title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_label + "Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            columns.push(component_label + "Button Label");
            samples.push(extractDataFromArray(component, ["button_label"], ""));

            columns.push(component_label + "Button Link");
            samples.push(extractDataFromArray(component, ["button_link"], ""));
        },
    },
    video: {
        getInputWrapperHtml: function(data) {
            const video_types = {
                youtube: "YouTube",
                vimeo: "Vimeo",
            };

            function getVideoTypeGroupButtons(selected_type) {
                let buttonHtmls = "";
                Object.keys(video_types).forEach((type) => {
                    buttonHtmls +=
                        '<button type="button" class="btn btn-light ' +
                        (type == selected_type ? "active" : "") +
                        ' video_type_btn" data-type="' +
                        type +
                        '">' +
                        video_types[type] +
                        "</button>";
                });
                return (
                    ` <div class="btn-group" role="group">
                            ` +
                    buttonHtmls +
                    `
                            
                        </div>`
                );
            }
            return (
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) +
                `<div class="col-md-12 mb-3">
                ` +
                getVideoTypeGroupButtons(
                    extractDataFromArray(data, ["video_type"], "youtube")
                ) +
                `
            </div>` +
                QRPageComponentWrapper.getInputText(
                    "Video Link",
                    "video_link",
                    extractDataFromArray(data, ["video_link"], "")
                )
            );
        },
        title: "Video",
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let video_type = $(parent).find(".btn-group .btn.active").data("type");
            let video_link = $(parent).find("input[name=video_link]").val();
            if (video_type == "youtube") {
                if (!video_link.includes("www.youtube.com/embed/")) {
                    if (video_link.includes("youtu.be")) {
                        video_link = video_link.split(".be/")[1];
                    } else if (video_link.includes("/watch?v=")) {
                        video_link = video_link.split("v=")[1];
                    } else {
                        video_link = "";
                    }
                    video_link = "https://www.youtube.com/embed/" + video_link;
                }
            } else if (video_type == "vimeo") {
                if (!video_link.includes("player.vimeo.com/video")) {
                    video_link = video_link.split("vimeo.com/")[1];
                    video_link = "https://player.vimeo.com/video/" + video_link;
                }
            }
            return {
                ...header,
                video_type,
                video_link,
            };
        },
        getPreviewHtml: function(data) {
            let videoHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "video"
            );

            // get header
            let headerHtml = getComponentHeaderHtml(data, videoHtmlConfig);

            // get video
            let videoHtml = "";
            let videoLink = extractDataFromArray(data, ["video_link"], "");
            videoLink = videoLink.trim();
            if (!empty(videoLink)) {
                videoHtml = extractDataFromArray(videoHtmlConfig, ["video"], "");
                videoHtml = videoHtml.cleanReplace("___video_link___", videoLink);
            }

            if (empty(headerHtml) && empty(videoHtml)) {
                return "";
            }

            let main = videoHtmlConfig.main;
            main = main.cleanReplace("___header_html___", headerHtml);
            main = main.cleanReplace("___video_html___", videoHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "video",
            header_enable: 1,
            title: "Video",
            desc: "Description",
            video_type: "youtube",
            video_link: "",
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_label = component_index + ".Video.";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_label + "title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_label + "Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            columns.push(component_label + "Type");
            samples.push(extractDataFromArray(component, ["video_type"], ""));

            columns.push(component_label + "URL");
            samples.push(extractDataFromArray(component, ["video_link"], ""));
        },
    },
    password: {
        getInputWrapperHtml: function(data, index) {
            function getProtectionTypeHtml(type, contacts) {
                return (
                    ` <div class="col-md-12 mb-4">
                            <div class="row mx-0">
                                <div class="mr-2 mb-3" > Make this page password protected</div>` +
                    QRPageComponentWrapper.getSwitcheryButton(
                        "page_protection_enable",
                        type == "page"
                    ) +
                    `
                            </div>
                            <div class="row mx-0">
                                <div class="mr-2 mb-2" > Make contact information password protected</div>` +
                    QRPageComponentWrapper.getSwitcheryButton(
                        "contact_protection_enable",
                        type == "contact"
                    ) +
                    `
                            </div>
                            <div class="gray_card pl-4 contact_protect">
                                <div class="custom-control custom-checkbox custom-control-inline">
                                    <input type="checkbox" id="ct_pr_email_` +
                    index +
                    `" class="custom-control-input" name="email" ` +
                    (extractDataFromArray(contacts, ["email"], 0) == 1 ? "checked" : "") +
                    `>
                                    <label class="custom-control-label" for="ct_pr_email_` +
                    index +
                    `">Email</label>
                                </div>  
                                <div class="custom-control custom-checkbox custom-control-inline">
                                    <input type="checkbox" id="ct_pr_number_` +
                    index +
                    `" class="custom-control-input" name="number" ` +
                    (extractDataFromArray(contacts, ["number"], 0) == 1 ?
                        "checked" :
                        "") +
                    `>
                                    <label class="custom-control-label" for="ct_pr_number_` +
                    index +
                    `">Number</label>
                                </div>  
                                <div class="custom-control custom-checkbox custom-control-inline">
                                    <input type="checkbox" id="ct_pr_address_` +
                    index +
                    `" class="custom-control-input" name="address" ` +
                    (extractDataFromArray(contacts, ["address"], 0) == 1 ?
                        "checked" :
                        "") +
                    `>
                                    <label class="custom-control-label" for="ct_pr_address_` +
                    index +
                    `">Address</label>
                                </div>  
                            </div>
                            
                        </div>`
                );
            }

            function getUsernameAndPasswordHtml() {
                return (
                    `<div class="col-md-12 mb-4">
                            <div class="row mx-0 gray_card">
                                <div class="col-md-12 d-flex">
                                    <div class="mr-2 mb-3 " >Enable Username</div>` +
                    QRPageComponentWrapper.getSwitcheryButton(
                        "username_enable",
                        data.username_enable
                    ) +
                    `
                                </div>
                                ` +
                    QRPageComponentWrapper.getInputText(
                        "Label",
                        "username_label",
                        data.username_label,
                        6
                    ) +
                    `
                                ` +
                    QRPageComponentWrapper.getInputText(
                        "Value",
                        "username_value",
                        data.username_value,
                        6
                    ) +
                    `
                                <div class="col-md-12 d-flex">
                                    <div class="mr-2 my-2 " >Password</div>  
                                </div>
                                ` +
                    QRPageComponentWrapper.getInputText(
                        "Label",
                        "password_label",
                        data.password_label,
                        6
                    ) +
                    `
                                ` +
                    QRPageComponentWrapper.getInputText(
                        "Value",
                        "password_value",
                        data.password_value,
                        6
                    ) +
                    `
                                ` +
                    QRPageComponentWrapper.getInputText(
                        "Button Label",
                        "button_label",
                        data.button_label,
                        12
                    ) +
                    `
                            </div>
                        </div>`
                );
            }
            return (
                getProtectionTypeHtml(
                    extractDataFromArray(data, ["protection_type"], "page"),
                    extractDataFromArray(data, ["contacts"], [])
                ) +
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) +
                getUsernameAndPasswordHtml()
            );
        },
        title: "Password Protection",
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);

            let protection_type = "";
            if ($("input[name=page_protection_enable]").prop("checked")) {
                protection_type = "page";
            } else if ($("input[name=contact_protection_enable]").prop("checked")) {
                protection_type = "contact";
            }

            let contacts = {};
            Array.from($(parent).find(".contact_protect input")).forEach((ele) => {
                contacts[ele.name] = ele.checked;
            });
            return {
                ...header,
                protection_type,
                contacts,
                username_enable: $(parent)
                    .find("input[name=username_enable]")
                    .prop("checked") ?
                    1 :
                    0,
                username_label: $(parent).find("input[name=username_label]").val(),
                username_value: $(parent).find("input[name=username_value]").val(),
                password_label: $(parent).find("input[name=password_label]").val(),
                password_value: $(parent).find("input[name=password_value]").val(),
                button_label: $(parent).find("input[name=button_label]").val(),
            };
        },
        default: {
            component: "password",
            header_enable: 1,
            title: "Heading Text",
            desc: "Heading Description",
            protection_type: "page",
            contacts: {
                email: 1,
                number: 1,
                address: 1
            },
            username_enable: 1,
            username_label: "Username",
            username_value: "Login Id",
            password_label: "Password",
            password_value: "12345",
            button_label: "Login",
        },
    },
    forms: {
        field_types: {
            text: {
                title: "Text"
            },
            email: {
                title: "Email"
            },
            number: {
                title: "Number"
            },
            tel: {
                title: "Phone Number",
                isValidFunc: function(value) {
                    // add country code later   /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                    if (value.match(/\d/g) == null) {
                        return false;
                    }
                    return value.match(/\d/g).length === 10;
                },
                // extraInputHtml: function (data, index) {
                //     return `<div class="col">
                //                 <div class="form-group">
                //                     <div class="custom-control custom-checkbox custom-control-inline">
                //                         <input type="checkbox" id="enable_otp_verification_`+ index + `" class="custom-control-input" name="enable_otp_verification" ` + (extractDataFromArray(data, ['otp_verification'], 0) == 1 ? 'checked' : '') + `>
                //                         <label class="custom-control-label" for="enable_otp_verification_`+ index + `">OTP Verification</label>
                //                     </div>
                //                 </div>
                //             </div>`
                // }
            },
            textarea: {
                title: "TextArea"
            },
        },
        getFormFieldHtml: function(data, index) {
            let optionsHtml = "";
            Object.keys(ComponentLists.forms.field_types).forEach((option) => {
                if (option == "weburl") {
                    return;
                }
                optionsHtml +=
                    '<option value="' +
                    option +
                    '" ' +
                    (option == data.type ? "selected" : "") +
                    ">" +
                    ComponentLists.forms.field_types[option].title +
                    "</option>";
            });
            let extraInputHtmlFunc = extractDataFromArray(
                ComponentLists.forms.field_types, [data.type, "extraInputHtml"],
                ""
            );
            let extraInputHtml = "";
            if (!empty(extraInputHtmlFunc)) {
                extraInputHtml = extraInputHtmlFunc(data, index);
            }
            return (
                `<div class="list-group-item web_link_input_wrapper subcomponent_sortable_wrapper mb-4"  data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `">
            ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-web-link"><i class="icon-drag_1"></i></a>
                        </div>`) +
                `
                        <div class="row">
                            <div class="col-md-12">
                                <div class="input-group my-3">
                                    <div class="input-group-prepend">
                                        <select class="form-control select2_no_search social_media_select" name="type" ` +
                (QRPageComponents.isBulkUploadQRCode() ? "disabled" : "") +
                ` >` +
                optionsHtml +
                `</select>
                                    </div>
                                    <input type="text" class="form-control" name="url" value="` +
                extractDataFromArray(data, ["label"], "Label") +
                `" placeholder="URL">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group ">
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" id="enable_req_` +
                index +
                `" class="custom-control-input" name="required" ` +
                (extractDataFromArray(data, ["required"], 0) == 1 ? "checked" : "") +
                `>
                                        <label class="custom-control-label" for="enable_req_` +
                index +
                `">Mandatory</label>
                                    </div>  
                                </div>  
                            </div>
                        ` +
                extraInputHtml +
                `
                        </div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getFormsContainer(form_config) {
                let form_html_wrapper = `<div class="col-md-12 title_desc_wrapper">
                                            <div><h5>Forms</h5></div>`;
                form_config.forEach((form, form_index) => {
                    let form_fields_html = "";
                    extractDataFromArray(form, ["form_fields"], []).forEach(
                        (form_field, field_index) => {
                            form_fields_html += ComponentLists.forms.getFormFieldHtml(
                                form_field,
                                index + "_" + form_index + "_" + field_index
                            );
                        }
                    );
                    form_html_wrapper +=
                        `<div class="col-md-12 px-3 form_container">
                                            <div class="row mx-0 list-group mt-3 form_wrapper" id="form_wrapper_` +
                        index +
                        `_` +
                        form_index +
                        `">
                                                ` +
                        form_fields_html +
                        `
                                            </div> 
                                        </div>`;
                });
                form_html_wrapper += "</div> ";
                return form_html_wrapper;
            }

            function getFormSubmissionContainer(data) {
                return `<div class="col-md-12 title_desc_wrapper">
                    <div><h5>Submit Action</h5></div>
                    <div class="row mx-0 title_desc_wrapper_input gray_card mb-4 ">
                        <br />
                        <br />
                    </div> 
                </div> `;
            }

            return (
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) +
                '<div class="col-md-12 border-top mb-3"></div>' +
                getFormsContainer(extractDataFromArray(data, ["form_config"], [])) +
                '<div class="col-md-12 border-top mb-3"></div>' +
                getFormSubmissionContainer(data)
            );
        },
        title: "Form",
        listeners: function(index) {
            Array.from($(".form_wrapper")).forEach((ele) => {
                new Sortable(ele, {
                    handle: ".handle-web-link", // handle class
                    animation: 150,
                    ghostClass: "blue-background-class",
                    onEnd: function(e) {
                        // debugger
                        QRPageComponents.handleInputChange(e);
                    },
                });
            });
        },
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let links = [];
            Array.from($(parent).find(".web_link_input_wrapper")).forEach((ele) => {
                let icon_img = $(ele)
                    .find(".img_uploaded_card.selected_img")
                    .css("background-image");
                if (!empty(icon_img)) {
                    icon_img = icon_img.split('"')[1];
                }
                links.push({
                    url: $(ele).find("input[name=url]").val(),
                    title: $(ele).find("input[name=title]").val(),
                    subtitle: $(ele).find("input[name=subtitle]").val(),
                    subtitle_enable: $(ele)
                        .find("input[name=subtitle_enable]")
                        .prop("checked") ?
                        1 :
                        0,
                    icon_img,
                    _id: $(ele).data("id"),
                });
            });
            return {
                ...header,
                links,
            };
        },
        getListeners: function() {
            return `  $(document).on("click", ".qrc_button_submit", function(e){
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

                         
                         `;
        },
        _otp: "",
        validateForm: function(ele) {
            function getAllFormFields(step_wrapper_id) {
                const step_wrapper_id_arr = step_wrapper_id.split("_");
                const step_config = extractDataFromArray(QRPageComponents.components, [
                    step_wrapper_id_arr[1],
                    "form_config",
                    step_wrapper_id_arr[2],
                ]);
                let form_fields = {};
                let proceed = true;
                $(".qrc_form_field").removeClass("invalid_field");
                $(".qrc_terms").removeClass("invalid_field");
                ComponentLists.forms._otp = "";
                Array.from($("#" + step_wrapper_id).find(".qrc_form_field")).forEach(
                    (form_field, field_index) => {
                        const type = $(form_field).data("type");
                        const value = $(form_field).find("input").val();

                        let isValidFunc = extractDataFromArray(
                            ComponentLists.forms.field_types, [type, "isValidFunc"],
                            ""
                        );
                        if (!empty(isValidFunc)) {
                            if (!isValidFunc(value)) {
                                proceed = false;
                                $(form_field).addClass("invalid_field");
                            }
                        }
                        if (
                            extractDataFromArray(
                                step_config, ["form_fields", field_index, "required"],
                                false
                            ) &&
                            empty(value)
                        ) {
                            proceed = false;
                            $(form_field).addClass("invalid_field");
                        }

                        if (type == "tel") {
                            ComponentLists.forms._otp = value;
                        }
                    }
                );

                if ($("#" + step_wrapper_id).find(".qrc_terms").length) {
                    if (!$("#terms_check_box").prop("checked")) {
                        $("#" + step_wrapper_id)
                            .find(".qrc_terms")
                            .addClass("invalid_field");
                        proceed = false;
                    }
                }

                return proceed;
            }
            let step_wrapper = $(ele).parents(".qrc_form_step_wrapper").attr("id");

            if (!getAllFormFields(step_wrapper)) {
                return;
            }
            if ($("#" + step_wrapper + "_otp").length == 1) {
                ComponentLists.forms.triggerOTP(step_wrapper);
            } else {
                let form_response = {
                    "Mobile Number": $("#form_1_0 input").val(),
                    otp: $("#form_1_0_otp input").val(),
                    url_params: getUrlVars(),
                };
                ComponentLists.forms.submitForm(form_response);
            }
        },
        triggerOTP: function(step_wrapper = "") {
            $.post(
                "/user/services/openapi", {
                    cmd: "triggerOTPForm",
                    phone: ComponentLists.forms._otp,
                    short_url: extractDataFromArray(
                        __savedQrCodeParams, ["short_url"],
                        ""
                    ),
                },
                function(response) {
                    if (response.errorCode == 0) {
                        if (!empty(step_wrapper)) {
                            $("#" + step_wrapper).hide();
                            $("#" + step_wrapper + "_otp").show();
                        }
                    } else {
                        alert("Error Occured. Please try again.");
                    }
                }
            );
        },

        submitForm: function(form_response) {
            // let form_config = extractDataFromArray(QRPageComponents.components, [1, 'form_config'], []);

            $.post(
                "/user/services/openapi", {
                    cmd: "verifyOTPForm",
                    otp: $("#form_1_0_otp input").val(),
                    short_url: extractDataFromArray(
                        __savedQrCodeParams, ["short_url"],
                        ""
                    ),
                    form_response: JSON.stringify(form_response),
                },
                function(response) {
                    if (response.errorCode == 0) {
                        location.href = response.data;
                    } else {
                        alert(response.errorMsg);
                    }
                }
            );
        },
        goBack: function(ele) {
            let step_wrapper = $(ele).parents(".qrc_form_step_wrapper").attr("id");
            if (step_wrapper.indexOf("otp") > -1) {
                $("#" + step_wrapper).hide();
                $("#" + step_wrapper.replace("_otp", "")).show();
            }
        },
        getPreviewHtml: function(data, componentIndex) {
            let formsHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "forms"
            );

            let main = formsHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, formsHtmlConfig);

            let formHtml = "";

            function getOTPVerificationHtml(id) {
                let formFieldHtml = formsHtmlConfig.form_field;
                formFieldHtml = formFieldHtml.cleanReplace("___label___", "OTP Number");
                let fieldHtml = extractDataFromArray(formsHtmlConfig, ["number"], "");
                formFieldHtml = formFieldHtml.cleanReplace(
                    "___form_field____",
                    fieldHtml
                );
                let formStepHtml = formsHtmlConfig.form_step_wrapper.cleanReplace(
                    "___form_elements___",
                    formFieldHtml
                );
                let buttonHtml = formsHtmlConfig.submit_button.cleanReplace(
                    "___btn_label___",
                    "Verify OTP"
                );
                formStepHtml = formStepHtml.cleanReplace(
                    "___visibility___",
                    'style="display:none;"'
                );
                formStepHtml = formStepHtml.cleanReplace("___step_id___", id);
                buttonHtml += `<a rel="nofollow noopener noreferrer" href="#" class="qrc_button_transparent resend_otp" style="margin-top:1em" target="_blank">Resend OTP</a><a rel="nofollow noopener noreferrer" href="#" class="qrc_button_transparent change_number" target="_blank">Change Mobile Number</a>`;
                formStepHtml = formStepHtml.cleanReplace(
                    "___submit_button___",
                    buttonHtml
                );
                formStepHtml = formStepHtml.cleanReplace("___terms_checkbox___", "");

                return formStepHtml;
            }
            extractDataFromArray(data, ["form_config"], []).forEach((form, index) => {
                let formStepHtml = "";
                let otp_enabled = false;
                extractDataFromArray(form, ["form_fields"], []).forEach(
                    (form_field) => {
                        let formFieldHtml = formsHtmlConfig.form_field;
                        let label = extractDataFromArray(form_field, ["label"], "");
                        if (extractDataFromArray(form_field, ["required"], false)) {
                            label += '<span style="color:red;"> *</span>';
                        }
                        formFieldHtml = formFieldHtml.cleanReplace("___label___", label);
                        let fieldHtml = extractDataFromArray(
                            formsHtmlConfig, [extractDataFromArray(form_field, ["type"], "text")],
                            ""
                        );
                        formFieldHtml = formFieldHtml.cleanReplace(
                            "___form_field____",
                            fieldHtml
                        );
                        formFieldHtml = formFieldHtml.cleanReplace(
                            "___type___",
                            extractDataFromArray(form_field, ["type"], "text")
                        );
                        formStepHtml += formFieldHtml;
                        if (
                            extractDataFromArray(
                                form_field, ["enable_otp_verification"],
                                false
                            )
                        ) {
                            otp_enabled = true;
                        }
                    }
                );
                if (!empty(formStepHtml)) {
                    let formStepHtmlWrapper =
                        formsHtmlConfig.form_step_wrapper.cleanReplace(
                            "___form_elements___",
                            formStepHtml
                        );
                    let buttonHtml = formsHtmlConfig.submit_button.cleanReplace(
                        "___btn_label___",
                        extractDataFromArray(form, ["submit_button_text"], "Submit")
                    );
                    formStepHtmlWrapper = formStepHtmlWrapper.cleanReplace(
                        "___visibility___",
                        index == 0 ? "" : 'style="display:none;"'
                    );
                    formStepHtmlWrapper = formStepHtmlWrapper.cleanReplace(
                        "___step_id___",
                        "form_" + componentIndex + "_" + index
                    );
                    formStepHtmlWrapper = formStepHtmlWrapper.cleanReplace(
                        "___submit_button___",
                        buttonHtml
                    );
                    formStepHtmlWrapper = formStepHtmlWrapper.cleanReplace(
                        "___terms_checkbox___",
                        formsHtmlConfig.terms_check_box
                    );
                    formHtml += formStepHtmlWrapper;
                }

                if (otp_enabled) {
                    formHtml += getOTPVerificationHtml(
                        "form_" + componentIndex + "_" + index + "_otp"
                    );
                }
            });

            if (!empty(formHtml)) {
                formHtml = formsHtmlConfig.form_container.cleanReplace(
                    "___form_steps___",
                    formHtml
                );
            }

            main = main.cleanReplace("___header_html___", headerHtml);
            main = main.cleanReplace("___form_container___", formHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "forms",
            header_enable: 1,
            title: "Form Heading",
            desc: "Description",
            links: [{
                url: "",
                title: "Title",
                subtitle: "",
                subtitle_enable: 0,
                icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
            }, ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Card title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Card Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            extractDataFromArray(component, ["links"], []).forEach((link, index) => {
                let prefix = component_order + "Web Link:" + (index + 1);

                columns.push(prefix + ".title");
                samples.push(extractDataFromArray(link, ["title"], ""));

                if (parseInt(extractDataFromArray(link, ["subtitle_enable"], 1))) {
                    columns.push(prefix + ".subtitle");
                    samples.push(extractDataFromArray(link, ["subtitle"], ""));
                }

                columns.push(prefix + ".icon_img");
                samples.push(extractDataFromArray(link, ["icon_img"], ""));

                columns.push(prefix + ".url");
                samples.push(extractDataFromArray(link, ["url"], ""));
            });
        },
    },
    business_hours: {
        getBusinessHoursFieldHtml: function(data, weekDay) {
            return (
                `<div class="business_hours_field_input_wrapper mb-4 week_row" data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `">
                <div class="row" style="margin-bottom:4px">
                    <div class="col-md-4">
                        ` + QRPageComponentWrapper.getCheckboxButton(
                    extractDataFromArray(data, ["enable"], 1),
                    weekDay
                ) + `
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <input type='text' class="form-control week_day_label" name="` + (weekDay.charAt(0).toUpperCase() + weekDay.slice(1)) + `" value="` + extractDataFromArray(data, ["label"], "") + `" />
                    </div>
                    <div class="col-md-8 business_hours_row">
                        <div class="row">
                            <div class="col-sm-5 input_css">
                            ` + QRPageComponentWrapper.getInputTimeText(
                    weekDay + "_first_start_time",
                    extractDataFromArray(data, ["first_start_time"], "")
                ) + `
                            </div>
                            <div class="col-sm-5 input_css">
                            ` + QRPageComponentWrapper.getInputTimeText(
                    weekDay + "_first_end_time",
                    extractDataFromArray(data, ["first_end_time"], "")
                ) + `
                            </div>
                            <div class="col-sm-2 input_css">
                                <a class="btn add_second_time_hours ` + (data['second_time_enable'] == 1 ? "" : "collapsed") + `" data-toggle="collapse" href="#` + weekDay + `_second_time_enable" 
                                aria-expanded="` + data["second_time_enable"] + `" aria-controls="` + weekDay + `_second_time_enable"></a>
                            </div>
                        </div>
                        <div class="collapse ` + (data['second_time_enable'] == 1 ? "show" : "") + `" id="` + weekDay + `_second_time_enable">
                            <div class="row">
                                <div class="col-sm-5 input_css">
                                ` + QRPageComponentWrapper.getInputTimeText(
                    weekDay + "_second_start_time",
                    extractDataFromArray(data, ["second_start_time"], "")
                ) + `
                                </div>
                                <div class="col-sm-5 input_css">
                                ` + QRPageComponentWrapper.getInputTimeText(
                    weekDay + "_second_end_time",
                    extractDataFromArray(data, ["second_end_time"], "")
                ) + `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getBusinessHoursField(data) {
                let week_days = extractDataFromArray(data, ["week_days"], {});
                if (empty(week_days)) {
                    week_days = ComponentLists['business_hours'].default.week_days;
                }
                let weekDaysHtml = "";

                let weeks = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

                weeks.forEach((weekDay) => {
                    if (week_days[weekDay] !== undefined) {
                        weekDaysHtml += ComponentLists.business_hours.getBusinessHoursFieldHtml(week_days[weekDay], weekDay);
                    } else {
                        weekDaysHtml += ComponentLists.business_hours.getBusinessHoursFieldHtml(ComponentLists['business_hours'].default.week_days[weekDay], weekDay);
                    }
                })
                return (
                    `<div class="col-md-12 px-3 ">
                        <div class="row mx-0 list-group mt-3" id="business_hours_container_` +
                    index +
                    `">
                                ` +
                    weekDaysHtml +
                    `
                            </div>
                            ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        ``) +
                    `
                        </div>`
                );
            }

            return (
                QRPageComponentWrapper.getInputText(
                    "Title",
                    "title",
                    extractDataFromArray(data, ["title"], "")
                ) +
                QRPageComponentWrapper.getImageUploader(
                    "", [
                        extractDataFromArray(
                            data, ["pr_img"],
                            "/images/defaultImages/businesspage/hours_img.png"
                        ),
                    ]
                ) + `<div style="width:100%" id="business_hours_wrapper">
                        <div class="row mx-0" style="padding:14px 16px 14px 16px;">
                            <div class="mr-2 mb-2" >Open 24 Hrs</div>` +
                QRPageComponentWrapper.getSwitcheryButton(
                    "open_24_enable",
                    extractDataFromArray(data, ["open_24_enable"], 0)
                ) +
                `
                        </div>
                        <div id="business_hours_input_wrapper">
                        <div class="col-md-6 px-0" id="business_hours_container_1" style="` +
                ((extractDataFromArray(data, ["open_24_enable"], 0) == 1) ?
                    "" :
                    "display:none;") +
                `">` + QRPageComponentWrapper.getInputText(
                    "Opening/Closing Status",
                    "open_24_status_text",
                    extractDataFromArray(data, ["open_24_status_text"], "")
                ) + `</div>
                        <div id="business_hours_container_2" style="` +
                ((extractDataFromArray(data, ["open_24_enable"], 0) == 1) ?
                    "display:none;" :
                    "") +
                `">
                                <div class="d-flex">
                                    <div class="col-md-6 px-0">` + QRPageComponentWrapper.getInputText(
                    "Opening Status",
                    "opening_status_text",
                    extractDataFromArray(data, ["opening_status_text"], "")
                ) + `
                                    </div>
                                    <div class="col-md-6 px-0">` + QRPageComponentWrapper.getInputText(
                    "Closing Status",
                    "closing_status_text",
                    extractDataFromArray(data, ["closing_status_text"], "")
                ) + `
                                    </div>    
                                </div>` + getBusinessHoursField(data) + `
                        </div>
                        </div>        
                     </div>`
            );
        },
        title: "Business Hours",
        listeners: function(index) {
            $(document).on("click", ".add_second_time", function(e) {
                var name = $(this).attr("href").replace("#", "");
                if ($(this).text() == '+') {
                    $(this).text('-')
                    $('input[name=' + name + ']').val(true)
                } else {
                    $(this).text('+')
                    $('input[name=' + name + ']').val(false)
                }
            })
            let weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            weekDays.forEach((day, i) => {
                $('input[name=' + day + ']').off('click').on("click", function(e) {
                    $(e.target).val(e.target.checked);
                });
                QRPageComponentWrapper.getDateTimePickerInput('.' + day + '_first_start_time', true);
                QRPageComponentWrapper.getDateTimePickerInput('.' + day + '_first_end_time', false);
                QRPageComponentWrapper.getDateTimePickerInput('.' + day + '_second_start_time', true);
                QRPageComponentWrapper.getDateTimePickerInput('.' + day + '_second_end_time', false);
            })
            new Sortable(document.getElementById("business_hours_input_wrapper"), {
                handle: ".handle-custom-field", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        getInputData: function(index, parent) {
            let pr_img = $(parent)
                .find(".img_uploaded_card.selected_img")
                .css("background-image");
            if (!empty(pr_img)) {
                pr_img = pr_img.split('"')[1];
            }
            if (pr_img == location.href) {
                pr_img = "";
            }

            let week_days = {};

            if (!$(parent).find("input[name=open_24_enable]").prop("checked")) {

                let weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                let weekDaysStartWithCapital = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

                Array.from($(parent).find(".business_hours_field_input_wrapper")).forEach(
                    (ele, index) => {
                        let first_time_enable = 0;
                        let first_start_time = "";
                        let first_end_time = "";

                        let second_time_enable = 0;
                        let second_start_time = "";
                        let second_end_time = "";

                        if ($(parent).find("input[name='" + weekDays[index] + "']").prop("checked")) {
                            if ($('input[name="' + weekDays[index] + '_first_start_time').val() !== "" || $('input[name="' + weekDays[index] + '_first_end_time').val() !== "" ||
                                $('input[name="' + weekDays[index] + '_second_start_time').val() !== "" || $('input[name="' + weekDays[index] + '_second_end_time').val() !== "") {
                                first_time_enable = 1;
                            }
                            if ($('input[name="' + weekDays[index] + '_second_start_time').val() !== "" || $('input[name="' + weekDays[index] + '_second_end_time').val() !== "") {
                                second_time_enable = 1;
                            }

                            if (first_time_enable == 1) {
                                first_start_time = $(ele).find('input[name="' + weekDays[index] + '_first_start_time"]').val();
                                first_end_time = $(ele).find('input[name="' + weekDays[index] + '_first_end_time"]').val();
                                second_start_time = $(ele).find('input[name="' + weekDays[index] + '_second_start_time"]').val();
                                second_end_time = $(ele).find('input[name="' + weekDays[index] + '_second_end_time"]').val();
                            }

                            let label = $(ele).find('input[name="' + weekDaysStartWithCapital[index] + '"]').val();

                            if (empty(label)) {
                                label = weekDaysStartWithCapital[index];
                            }

                            week_days[weekDays[index]] = {
                                enable: $(ele).find("input[name='" + weekDays[index] + "']").prop("checked"),
                                first_start_time,
                                first_end_time,
                                second_time_enable,
                                second_start_time,
                                second_end_time,
                                label,
                                _id: $(ele).data("id"),
                            };
                        }
                    }
                );
            }

            return {
                title: $(parent).find("input[name=title]").val(),
                pr_img,
                open_24_enable: $(parent)
                    .find("input[name=open_24_enable]")
                    .prop("checked") ?
                    1 :
                    0,
                open_24_status_text: $(parent).find("input[name=open_24_status_text]").val(),
                opening_status_text: $(parent).find("input[name=opening_status_text]").val(),
                closing_status_text: $(parent).find("input[name=closing_status_text]").val(),
                week_days,
            };
        },
        getPreviewHtml: function(data) {
            let customFieldsHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "business_hours"
            );

            let main = customFieldsHtmlConfig.main;

            let pr_img = extractDataFromArray(data, ["pr_img"], "");
            let title = extractDataFromArray(data, ["title"], "");

            let prImgHtml = customFieldsHtmlConfig.pr_img;
            let titleHtml = customFieldsHtmlConfig.title;

            prImgHtml = prImgHtml.cleanReplace("___icon_img___", pr_img);
            titleHtml = titleHtml.cleanReplace("___title___", title);

            main = main.cleanReplace("___pr_img_html___", prImgHtml);
            main = main.cleanReplace("___title_html___", titleHtml);

            let toggleIconHtml = customFieldsHtmlConfig.toggle_icon;

            if (extractDataFromArray(data, ["open_24_enable"], 0) == 1) {
                let open24StatusText = extractDataFromArray(data, ["open_24_status_text"], "")

                let open24StatusTextHtml = customFieldsHtmlConfig.status;

                open24StatusTextHtml = open24StatusTextHtml.cleanReplace("___status___", open24StatusText);

                main = main.cleanReplace("___status_html___", open24StatusTextHtml);

                main = main.cleanReplace("___toggle_icon___", "")

                main = main.cleanReplace("___week_html___", "")

            } else {
                // let openStatusText = extractDataFromArray(data, ["opening_status_text"], "")
                let statusText = extractDataFromArray(data, ["closing_status_text"], "")

                let statusTextHtml = customFieldsHtmlConfig.status;

                main = main.cleanReplace("___toggle_icon___", toggleIconHtml)

                let dayListHtml = "";
                let week_days = extractDataFromArray(data, ["week_days"], {})
                let count = 0;
                let weeks = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
                for (let day in week_days) {
                    let day_of_week = week_days[day];
                    if (extractDataFromArray(day_of_week, ['enable'], 0) == 1) {
                        let dayHtml = customFieldsHtmlConfig.day;
                        dayHtml = dayHtml.cleanReplace("___day___", (extractDataFromArray(day_of_week, ['label'], '')));

                        let firstStartTime = extractDataFromArray(day_of_week, ['first_start_time'], "")
                        let firstEndTime = extractDataFromArray(day_of_week, ['first_end_time'], "")
                        let secondStartTime = extractDataFromArray(day_of_week, ['second_start_time'], "")
                        let secondEndTime = extractDataFromArray(day_of_week, ['second_end_time'], "")

                        if (!empty(firstStartTime) || !empty(firstEndTime)) {
                            dayHtml = dayHtml.cleanReplace("___first_timing___", firstStartTime + " - " + firstEndTime);
                        } else {
                            dayHtml = dayHtml.cleanReplace("___first_timing___", "");
                        }

                        if (!empty(secondStartTime) || !empty(secondEndTime)) {
                            dayHtml = dayHtml.cleanReplace("___second_timimg___", secondStartTime + " - " + secondEndTime);
                        } else {
                            dayHtml = dayHtml.cleanReplace("___second_timimg___", "");
                        }

                        dayListHtml += dayHtml;

                        let date = new Date();

                        // console.log(checkCurrentTimeWithBusinessHours(firstStartTime, firstEndTime, date))
                        weeks.forEach((item, index) => {
                            if (day == item) {
                                count = index + 1;
                            }
                        })

                        if (date.getDay() == count && (checkCurrentTimeWithBusinessHours(firstStartTime, firstEndTime, date) || checkCurrentTimeWithBusinessHours(secondStartTime, secondEndTime, date))) {
                            statusText = extractDataFromArray(data, ["opening_status_text"], "")
                        }
                    }
                    count++;
                }

                statusTextHtml = statusTextHtml.cleanReplace("___status___", statusText);
                main = main.cleanReplace("___status_html___", statusTextHtml);

                let weekHtml = customFieldsHtmlConfig.week;
                weekHtml = weekHtml.cleanReplace("___day_html___", dayListHtml);

                if (count > 1) {
                    main = main.cleanReplace("___week_html___", weekHtml);
                } else {
                    main = main.cleanReplace("___week_html___", "");
                }
            }
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "business_hours",
            title: "Opening Hours",
            pr_img: "/images/defaultImages/businesspage/hours_img.png",
            open_24_enable: 0,
            open_24_status_text: "Open 24 Hrs",
            opening_status_text: "Open",
            closing_status_text: "Closed",
            week_days: {
                monday: {
                    enable: 0,
                    first_start_time: "",
                    first_end_time: "",
                    second_time_enable: 0,
                    second_start_time: "",
                    second_end_time: "",
                    label: "Monday"
                },
                tuesday: {
                    enable: 0,
                    first_start_time: "",
                    first_end_time: "",
                    second_time_enable: 0,
                    second_start_time: "",
                    second_end_time: "",
                    label: "Tuesday"
                },
                wednesday: {
                    enable: 0,
                    first_start_time: "",
                    first_end_time: "",
                    second_time_enable: 0,
                    second_start_time: "",
                    second_end_time: "",
                    label: "Wednesday"
                },
                thursday: {
                    enable: 0,
                    first_start_time: "",
                    first_end_time: "",
                    second_time_enable: 0,
                    second_start_time: "",
                    second_end_time: "",
                    label: "Thursday"
                },
                friday: {
                    enable: 0,
                    first_start_time: "",
                    first_end_time: "",
                    second_time_enable: 0,
                    second_start_time: "",
                    second_end_time: "",
                    label: "Friday"
                },
                saturday: {
                    enable: 0,
                    first_start_time: "",
                    first_end_time: "",
                    second_time_enable: 0,
                    second_start_time: "",
                    second_end_time: "",
                    label: "Saturday"
                },
                sunday: {
                    enable: 0,
                    first_start_time: "",
                    first_end_time: "",
                    second_time_enable: 0,
                    second_start_time: "",
                    second_end_time: "",
                    label: "Sunday"
                },
            }
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            columns.push(component_order + "Business Hours Title");
            samples.push(extractDataFromArray(component, ["title"], ""));

            columns.push(component_order + "Business Hours Image");
            samples.push(extractDataFromArray(component, ["pr_img"], ""));

            if (parseInt(extractDataFromArray(component, ["open_24_enable"], 0))) {
                columns.push(component_order + "Opening/Closing Status");
                samples.push(extractDataFromArray(component, ["open_24_status_text"], ""));
            } else {
                columns.push(component_order + "Opening Status");
                samples.push(extractDataFromArray(component, ["opening_status_text"], ""));

                columns.push(component_order + "Closing Status");
                samples.push(extractDataFromArray(component, ["closing_status_text"], ""));

                let weekDays = extractDataFromArray(component, ["week_days"], {});

                for (let day in weekDays) {
                    let prefix = component_order + "Business Hours:" + (day);

                    if (parseInt(extractDataFromArray(weekDays[day], ["enable"], 0))) {
                        columns.push(prefix + ".label");
                        samples.push(extractDataFromArray(weekDays[day], ["label"], ""));

                        columns.push(prefix + ".1st start time");
                        samples.push(extractDataFromArray(weekDays[day], ["first_start_time"], ""));

                        columns.push(prefix + ".1st end time");
                        samples.push(extractDataFromArray(weekDays[day], ["first_end_time"], ""));

                        if (parseInt(extractDataFromArray(weekDays[day], ["second_time_enable"], 0))) {
                            columns.push(prefix + ".2nd start time");
                            samples.push(extractDataFromArray(weekDays[day], ["second_start_time"], ""));

                            columns.push(prefix + ".2nd end time");
                            samples.push(extractDataFromArray(weekDays[day], ["second_end_time"], ""));
                        }
                    }
                }

            }

        },
    },
    team: {
        getTeamFieldHtml: function(data) {
            return (
                `<div class="list-group-item team_field_input_wrapper subcomponent_sortable_wrapper mb-4" data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `">
            ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-custom-field"><i class="icon-drag_1"></i></a>
                        </div>
                        `) +
                `
                        <div class=""></div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getImageUploader(
                    "Profile", [extractDataFromArray(data, ["pr_img"], "/images/defaultImages/businesspage/team_thumb_2.png")],
                    "(250x250px, 1:1 Ratio)",
                    "",
                    1,
                    extractDataFromArray(data, ["enable_pr"], 1),
                    12,
                    "pr_img"
                ) +
                `
                        </div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getInputText("Name", "name", data.name, 6) +
                `
                            ` +
                QRPageComponentWrapper.getInputText("Designation", "designation", data.designation, 6) +
                `
                        </div>
                        <div class="row">` + QRPageComponentWrapper.getTextAreaInput("Profile Description", "description", data.description) + `</div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getCustomFields(data) {
                let fields = extractDataFromArray(data, ["fields"], []);
                let fieldsHtml = "";
                fields.forEach((field) => {
                    fieldsHtml += ComponentLists.team.getTeamFieldHtml(field);
                });
                return (
                    `<div class="col-md-12 px-3 ">
                        <div class="row mx-0 list-group mt-3" id="team_field_container_` +
                    index +
                    `">
                                ` +
                    fieldsHtml +
                    `
                            </div>
                            ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        `
                            <div class="row mx-0 mt-2" >
                                <button class="btn btn-outline-primary btn_add_team" ><i class="icon-add_1"></i>Add More</button>
                            </div>
                            `) +
                    `
                        </div>`
                );
            }

            return (
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) + getCustomFields(data)
            );
        },
        title: "Team",
        listeners: function(index) {
            new Sortable(document.getElementById("team_field_container_" + index), {
                handle: ".handle-custom-field", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let fields = [];
            Array.from($(parent).find(".team_field_input_wrapper")).forEach(
                (ele) => {
                    let icon_img = $(ele)
                        .find(".img_uploaded_card.selected_img")
                        .css("background-image");
                    if (!empty(icon_img)) {
                        icon_img = icon_img.split('"')[1];
                    }
                    fields.push({
                        name: $(ele).find("input[name=name]").val(),
                        designation: $(ele).find("input[name=designation]").val(),
                        description: $(ele).find("textarea[name=description]").val(),
                        pr_img: icon_img,
                        enable_pr: $(ele)
                            .find("input[name=enable_pr]")
                            .prop("checked") ?
                            1 :
                            0,
                        _id: $(ele).data("id"),
                    });
                }
            );
            return {
                ...header,
                fields,
            };
        },
        getPreviewHtml: function(data) {
            let customFieldsHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "team"
            );

            let main = customFieldsHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, customFieldsHtmlConfig);

            function getLinkHtml(data, index) {
                let memberImgHtml = customFieldsHtmlConfig.member_img;
                let fieldHtml = customFieldsHtmlConfig.item;

                let name = extractDataFromArray(data, ["name"], "");
                let designation = extractDataFromArray(data, ["designation"], "");
                let description = extractDataFromArray(data, ["description"], "");

                name = name.trim();
                designation = designation.trim();
                description = description.trim();

                let memberImg = "";
                if (extractDataFromArray(data, ["enable_pr"], 1) == 1) {
                    memberImg = extractDataFromArray(data, ["pr_img"], "");
                    memberImg = memberImg.trim();
                    memberImgHtml = memberImgHtml.cleanReplace("___member_img___", memberImg)
                } else {
                    memberImgHtml = ""
                }

                if (empty(memberImg) && empty(name) && empty(designation) && empty(description)) {
                    return "";
                }

                if (index == 0 && !empty(headerHtml)) {
                    fieldHtml = fieldHtml.cleanReplace("___header_html___", headerHtml)
                } else {
                    fieldHtml = fieldHtml.cleanReplace("___header_html___", "")
                }

                if (!empty(description)) {
                    fieldHtml = fieldHtml.cleanReplace("___hr_line___", customFieldsHtmlConfig.horizontal_line)
                } else {
                    fieldHtml = fieldHtml.cleanReplace("___hr_line___", '')
                }
                fieldHtml = fieldHtml.cleanReplace("___member_img_html___", memberImgHtml);
                fieldHtml = fieldHtml.cleanReplace("___name___", name);
                fieldHtml = fieldHtml.cleanReplace("___designation___", designation);
                return fieldHtml.cleanReplace("___description___", description);
            }

            let fieldsHtml = "";
            let fields = extractDataFromArray(data, ["fields"], []);
            data["fields"] = empty(fields) ? [{}] : fields;
            data["fields"].forEach((item, index) => {
                data["fields"][index]["_id"] =
                    typeof data["fields"][index]["_id"] == "undefined" ?
                    QRPageComponents.getUniqueId() :
                    data["fields"][index]["_id"];
                fieldsHtml += getLinkHtml(item, index);
            });

            if (empty(headerHtml) && empty(fieldsHtml)) {
                return "";
            }

            main = main.cleanReplace("___field_items___", fieldsHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "team",
            header_enable: 1,
            title: "",
            desc: "",
            fields: [{
                name: "Name",
                designation: "Designation",
                description: "",
                pr_img: "/images/defaultImages/businesspage/team_thumb_2.png",
                enable_pr: 1
            }, ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Card title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Card Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            extractDataFromArray(component, ["fields"], []).forEach(
                (field, index) => {
                    let prefix = component_order + "Team:" + (index + 1);

                    if (parseInt(extractDataFromArray(field, ["enable_pr"], 1))) {
                        columns.push(prefix + ".image");
                        samples.push(extractDataFromArray(field, ["pr_img"], ""));
                    }

                    columns.push(prefix + ".name");
                    samples.push(extractDataFromArray(field, ["name"], ""));

                    columns.push(prefix + ".designation");
                    samples.push(extractDataFromArray(field, ["designation"], ""));

                    columns.push(prefix + ".description");
                    samples.push(extractDataFromArray(field, ["description"], ""));
                }
            );
        },
    },
    testimonial: {
        getTestimonialFieldHtml: function(data) {
            return (
                `<div class="list-group-item testimonial_field_input_wrapper subcomponent_sortable_wrapper mb-4" data-id="` +
                extractDataFromArray(data, ["_id"], QRPageComponents.getUniqueId()) +
                `">
            ` +
                (QRPageComponents.isBulkUploadQRCode() ?
                    "" :
                    `
                        <div class="action_buttons">
                            <a class="btn btn_delete_pro_card"><i class="text-danger icon-delete_1"></i></a>
                            <a class="btn handle-custom-field"><i class="icon-drag_1"></i></a>
                        </div>
                        `) +
                `
                        <div class=""></div>
                        <div class="row">` + QRPageComponentWrapper.getTextAreaInput("Testimonial Text", "description", data.description) + `</div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getImageUploader(
                    "Photo", [extractDataFromArray(data, ["pr_img"], "/images/defaultImages/businesspage/testimonial_thumb.png")],
                    "(250x250px, 1:1 Ratio)",
                    "",
                    1,
                    extractDataFromArray(data, ["enable_pr"], 1),
                    12,
                    "pr_img"
                ) +
                `
                        </div>
                        <div class="row">
                            ` +
                QRPageComponentWrapper.getInputText("Name", "name", data.name, 6) +
                `
                            ` +
                QRPageComponentWrapper.getInputText("Designation", "designation", data.designation, 6) +
                `
                        </div>
                    </div>`
            );
        },
        getInputWrapperHtml: function(data, index) {
            function getCustomFields(data) {
                let fields = extractDataFromArray(data, ["fields"], []);
                let fieldsHtml = "";
                fields.forEach((field) => {
                    fieldsHtml += ComponentLists.testimonial.getTestimonialFieldHtml(field);
                });
                return (
                    `<div class="col-md-12 px-3 ">
                        <div class="row mx-0 list-group mt-3" id="testimonial_field_container_` +
                    index +
                    `">
                                ` +
                    fieldsHtml +
                    `
                            </div>
                            ` +
                    (QRPageComponents.isBulkUploadQRCode() ?
                        "" :
                        `
                            <div class="row mx-0 mt-2" >
                                <button class="btn btn-outline-primary btn_add_testimonial" ><i class="icon-add_1"></i>Add More</button>
                            </div>
                            `) +
                    `
                        </div>`
                );
            }

            return (
                QRPageComponentWrapper.getTitleDescSection(
                    extractDataFromArray(data, ["title"], ""),
                    extractDataFromArray(data, ["desc"], ""),
                    parseInt(extractDataFromArray(data, ["header_enable"], 0))
                ) + getCustomFields(data)
            );
        },
        title: "Testimonial",
        listeners: function(index) {
            new Sortable(document.getElementById("testimonial_field_container_" + index), {
                handle: ".handle-custom-field", // handle class
                animation: 150,
                ghostClass: "blue-background-class",
                onEnd: function(e) {
                    // debugger
                    QRPageComponents.handleInputChange(e);
                },
            });
        },
        getInputData: function(index, parent) {
            let header = QRPageComponentWrapper.getTitleDescSectionData(parent);
            let fields = [];
            Array.from($(parent).find(".testimonial_field_input_wrapper")).forEach(
                (ele) => {
                    let icon_img = $(ele)
                        .find(".img_uploaded_card.selected_img")
                        .css("background-image");
                    if (!empty(icon_img)) {
                        icon_img = icon_img.split('"')[1];
                    }
                    fields.push({
                        name: $(ele).find("input[name=name]").val(),
                        designation: $(ele).find("input[name=designation]").val(),
                        description: $(ele).find("textarea[name=description]").val(),
                        pr_img: icon_img,
                        enable_pr: $(ele)
                            .find("input[name=enable_pr]")
                            .prop("checked") ?
                            1 :
                            0,
                        _id: $(ele).data("id"),
                    });
                }
            );
            return {
                ...header,
                fields,
            };
        },
        getPreviewHtml: function(data) {
            let customFieldsHtmlConfig = getComponentHtmlFromTemplate(
                QRPageComponents.selected_template,
                "testimonial"
            );

            let main = customFieldsHtmlConfig.main;

            let headerHtml = getComponentHeaderHtml(data, customFieldsHtmlConfig);

            function getLinkHtml(data, index) {
                let memberImgHtml = customFieldsHtmlConfig.member_img;
                let fieldHtml = customFieldsHtmlConfig.item;

                let name = extractDataFromArray(data, ["name"], "");
                let designation = extractDataFromArray(data, ["designation"], "");
                let description = extractDataFromArray(data, ["description"], "");

                name = name.trim();
                designation = designation.trim();
                description = description.trim();

                let memberImg = "";
                if (extractDataFromArray(data, ["enable_pr"], 1) == 1) {
                    memberImg = extractDataFromArray(data, ["pr_img"], "");
                    memberImg = memberImg.trim();
                    memberImgHtml = memberImgHtml.cleanReplace("___member_img___", memberImg)
                } else {
                    memberImgHtml = ""
                }

                if (empty(memberImg) && empty(name) && empty(designation) && empty(description)) {
                    return "";
                }

                if (index == 0 && !empty(headerHtml)) {
                    fieldHtml = fieldHtml.cleanReplace("___header_html___", headerHtml)
                } else {
                    fieldHtml = fieldHtml.cleanReplace("___header_html___", "")
                }
                fieldHtml = fieldHtml.cleanReplace("___member_img_html___", memberImgHtml);
                fieldHtml = fieldHtml.cleanReplace("___name___", name);
                fieldHtml = fieldHtml.cleanReplace("___designation___", designation);
                return fieldHtml.cleanReplace("___description___", description);
            }

            let fieldsHtml = "";
            let fields = extractDataFromArray(data, ["fields"], []);
            data["fields"] = empty(fields) ? [{}] : fields;
            data["fields"].forEach((item, index) => {
                data["fields"][index]["_id"] =
                    typeof data["fields"][index]["_id"] == "undefined" ?
                    QRPageComponents.getUniqueId() :
                    data["fields"][index]["_id"];
                fieldsHtml += getLinkHtml(item, index);
            });

            if (empty(headerHtml) && empty(fieldsHtml)) {
                return "";
            }

            main = main.cleanReplace("___field_items___", fieldsHtml);
            return main.cleanReplace(/qr_cc_card/g, getCardClass(data));
        },
        default: {
            component: "testimonial",
            header_enable: 1,
            title: "",
            desc: "",
            fields: [{
                name: "Name",
                designation: "Designation",
                description: "",
                pr_img: "/images/defaultImages/businesspage/testimonial_thumb.png",
                enable_pr: 1
            }, ],
        },
        getColumnNames: function(component_index, columns, samples, component) {
            let component_order = component_index + ".";

            if (parseInt(extractDataFromArray(component, ["header_enable"], 1))) {
                columns.push(component_order + "Card title");
                samples.push(extractDataFromArray(component, ["title"], ""));

                columns.push(component_order + "Card Description");
                samples.push(extractDataFromArray(component, ["desc"], ""));
            }

            extractDataFromArray(component, ["fields"], []).forEach(
                (field, index) => {
                    let prefix = component_order + "Team:" + (index + 1);

                    columns.push(prefix + ".description");
                    samples.push(extractDataFromArray(field, ["description"], ""));

                    if (parseInt(extractDataFromArray(field, ["enable_pr"], 1))) {
                        columns.push(prefix + ".image");
                        samples.push(extractDataFromArray(field, ["pr_img"], ""));
                    }

                    columns.push(prefix + ".name");
                    samples.push(extractDataFromArray(field, ["name"], ""));

                    columns.push(prefix + ".designation");
                    samples.push(extractDataFromArray(field, ["designation"], ""));

                }
            );
        },
    },
};

const getComponentHeaderHtml = function(data, htmlConfig) {
    if (parseInt(extractDataFromArray(data, ["header_enable"], 0))) {
        let title = extractDataFromArray(data, ["title"], "");
        let desc = extractDataFromArray(data, ["desc"], "");
        title = title.trim();
        desc = desc.trim();
        if (empty(title) && empty(desc)) {
            return "";
        }

        let titleHtml = "";
        if (!empty(title)) {
            titleHtml = extractDataFromArray(htmlConfig, ["header_title"], "");
            titleHtml = titleHtml.cleanReplace("___title___", title);
        }

        let descHtml = "";
        if (!empty(desc)) {
            descHtml = extractDataFromArray(htmlConfig, ["header_desc"], "");
            descHtml = descHtml.cleanReplace("___desc___", desc);
        }

        let headerHtml = extractDataFromArray(htmlConfig, ["header"], "");
        headerHtml = headerHtml.cleanReplace("___header_title___", titleHtml);
        headerHtml = headerHtml.cleanReplace("___header_desc___", descHtml);

        return headerHtml;
    }
    return "";
};

const getComponentHtmlFromTemplate = function(template_id, component) {
    var pageType = extractDataFromArray(
        __savedQrCodeParams, ["page"],
        __page_type
    );
    var selectedPageArr = QRPageComponents_GetPageTypeTemplates(pageType);

    let htmlConfig =
        typeof selectedPageArr[template_id] != "undefined" &&
        typeof selectedPageArr[template_id]["html"] != "undefined" &&
        typeof selectedPageArr[template_id]["html"][component] != "undefined" ?
        selectedPageArr[template_id]["html"][component] :
        {};
    if (empty(htmlConfig)) {
        if (typeof DefaultHtmlTemplate[component] != "undefined") {
            htmlConfig = DefaultHtmlTemplate[component];
        }
    }

    return htmlConfig;
};

const checkCurrentTimeWithBusinessHours = function(startTime = "", endTime = "", currentTime = new Date()) {
    if (!empty(startTime) && !empty(endTime)) {
        let startTimeArray = startTime.split(":");
        let startHour = parseInt(startTimeArray[0]);
        let startMinute = parseInt(startTimeArray[1].split(" ")[0]);
        let startMeridian = startTimeArray[1].split(" ")[1];
        if (startMeridian == "PM" && startHour != 12) {
            startHour += 12;
        }

        let endTimeArray = endTime.split(":");
        let endHour = parseInt(endTimeArray[0]);
        let endMinute = parseInt(endTimeArray[1].split(" ")[0]);
        let endMeridian = endTimeArray[1].split(" ")[1];
        if (endMeridian == "PM" && endHour != 12) {
            endHour += 12;
        }

        let startDate = new Date();
        startDate.setHours(startHour, startMinute, 0, 0);

        let endDate = new Date();
        endDate.setHours(endHour, endMinute, 0, 0);

        return currentTime >= startDate && currentTime <= endDate;
    }
    return false;
}

const validateSelectedImages = function(selectedImages = []) {
    let result = [];
    if (selectedImages.length > 0 && typeof selectedImages[0] === 'string') {
        selectedImages.forEach((image) => {
            result.push({
                image,
                title: '',
                link: ''
            })
        })
        return result;
    }
    return selectedImages;
}

const getComponentStyleFromTemplate = function(template_id) {
    var pageType = extractDataFromArray(__savedQrCodeParams, ["page"], "");
    var selectedPageArr = QRPageComponents_GetPageTypeTemplates(pageType);

    var style =
        typeof selectedPageArr[template_id] != "undefined" &&
        typeof selectedPageArr[template_id].style != "undefined" ?
        selectedPageArr[template_id].style :
        {};
    return JSON.parse(JSON.stringify(style));
};

const getComponentContentFromTemplate = function(template_id) {
    var pageType = extractDataFromArray(__savedQrCodeParams, ["page"], "");
    var selectedPageArr = QRPageComponents_GetPageTypeTemplates(pageType);

    var content =
        typeof selectedPageArr[template_id] != "undefined" &&
        typeof selectedPageArr[template_id].content != "undefined" ?
        selectedPageArr[template_id].content :
        {};
    return JSON.parse(JSON.stringify(content));
};

const getCardClass = function(data) {
    return parseInt(extractDataFromArray(data, ["card_background"], 1)) ?
        "qr_cc_card" :
        "";
};

const DefaultHtmlTemplate = {
    event_profile: {
        main: `<div class="section qrc_ticket qr_cc_card">
                    ___pr_img_html___
                    <div class="qrc_ticket_details">
                        <div class="qrc_ticket_heading">___event_name___</div>
                        <div class="qrc_ticket_discription">___event_desc___</div>
                    </div>
                    <div class="qrc_ticket_user_name">
                        <div class="qrc_ticket_username_text">___name___</div>
                    </div>
                    ___qr_code___
                    ___lock_button___
                </div>`,
        pr_img: `<div class="qrc_ticket_image">
                    <img src="___pr_img___"/>
                </div>`,
        qr_code: `<div class="qrc_ticket_qrcode">
                        <img id="qrcode_event" src="___qr_img___" onerror="this.onerror=null;this.src=\'/images/qrcode_ticket.png\';" />
                    </div>  `,
        floating_button: `<button class="qrc_ticket_lock" style="cursor:pointer">
                                <img id="lock_event" src="___lock_img___" alt="Lock Image"/>
                            </button>`,
    },
    profile: {
        main: `<div class="section qrc_profile">
                    ___pr_img_html___
                    ___name_html___
                    ___desc_html___
                    ___company_html___
                    ___shortcut_html___
                </div>`,
        name: `<h2>___name___</h2>`,
        desc: `<p>___desc___</p>`,
        company: `<p><strong>___company___</strong></p>`,
        shortcut: `<div class="qrc_profile_shortcut">
                        <ul>___shortcut_items___</ul>
                    </div>`,
        item: `<li class="qr_cc_card"><a rel="nofollow noopener noreferrer" onclick="if(typeof triggerSocialUrlClicked == 'function') return triggerSocialUrlClicked(this);" href="___item_link___"  target="_blank"><span class="___item_icon___"></span></a></li>`,
        pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
    },
    logo: {
        main: `<div class="section qrc_profile">
                    ___pr_img_html___
                </div>`,
        pr_img: `<div class="qrc_logo" style="border-radius:___border_radius___%;"><img src="___pr_img___" /></div>`,
    },
    social_link: {
        main: ` <div class="section qrc_social_links">
                    <ul class="qrc_social_links_list">
                        ___link_item___
                    </ul>
                </div>`,
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        item_wrapper: ``,
        item: `<li class="qr_cc_card">
                    ___header_html___
                    <a  rel="nofollow noopener noreferrer social_link_a" onclick="if(typeof triggerSocialUrlClicked == 'function') return triggerSocialUrlClicked(this);" href="___item_url___"  target="_blank">
                        <div class="qrc_social_icon" style="background-image:url('___item_icon___');"></div>
                        <div class="qrc_social_text">
                            <div class="qrc_social_text_heading">___item_title___</div>
                            ___item_subtitle___
                        </div>
                        <div class="qrc_social_action">
                                <span class="icon-right_arrow"></span>
                        </div>
                    </a>
                </li>`,
        subtitle: `<div class="qrc_social_text_discription">___subtitle___</div>`,
    },
    pdf_gallery: {
        main: ` <div class="section qrc_social_links">
                    <ul class="qrc_social_links_list">
                        ___link_item___
                    </ul>
                </div>`,
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,

        item_wrapper: ``,
        item: `<li class="qr_cc_card">
                    ___header_html___
                    <a  rel="nofollow noopener noreferrer" href="___item_url___"  target="_blank">
                        <div class="qrc_social_icon" style="background-image:url('___item_icon___');"></div>
                        <div class="qrc_social_text">
                            <div class="qrc_social_text_heading">___item_title___</div>
                            ___item_subtitle___
                        </div>
                        <div class="qrc_social_action">
                                <span class="icon-right_arrow"></span>
                        </div>
                    </a>
                </li>`,
        subtitle: `<div class="qrc_social_text_discription">___subtitle___</div>`,
    },
    web_links: {
        main: ` <div class="section qrc_social_links">
                    <ul class="qrc_social_links_list">
                        ___link_item___
                    </ul>
                </div>`,
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        item_wrapper: ``,
        item: `<li class="qr_cc_card">
                    ___header_html___
                    <a  rel="nofollow noopener noreferrer" href="___item_url___" target="_blank">
                        <div class="qrc_social_icon" style="background-image:url('___item_icon___');"></div>
                        <div class="qrc_social_text">
                            <div class="qrc_social_text_heading">___item_title___</div>
                            ___item_subtitle___
                        </div>
                        <div class="qrc_social_action">
                                <span class="icon-right_arrow"></span>
                        </div>
                    </a>
                </li>`,
        subtitle: `<div class="qrc_social_text_discription">___subtitle___</div>`,
    },
    images: {
        main: ` <div class="section qrc_gallery qr_cc_card">
                    ___header_html___
                    ___images_html___
                </div>`,
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        image_container: `<div class="qrc_gallery_wrapper"><ul class="___view_type___">___images___</ul></div>`,
        image: `<li>
                    <a rel="nofollow noopener noreferrer" href="___img_src___" data-lightbox="images-gallery" >
                        <img class="img-fluid" src="___img_src___">
                    </a>
                </li>`,
    },
    image_gallery: {
        main: ` <div class="section qrc_gallery qr_cc_card">
                    ___header_html___
                    ___images_html___
                </div>`,
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        slider: `<div class="qrc_gallery_wrapper">
                    <div class="swiper mySwiper">
                        <div class="swiper-wrapper">
                            ___slide_html___
                        </div>
                        <div class="swiper-pagination">
                    </div>
                </div>
                </div>`,
        slide_html: `<div class="swiper-slide">
                        <a class="link" rel="nofollow noopener noreferrer" style="width:100%" href="___image_link___" >
                            <div class="slide" style="background-image:url('___img_src___')"></div>
                        </a>
                    </div>`,
        image_container: `<div class="qrc_gallery_wrapper"><ul class="___view_type___">___images___</ul></div>`,
        image: `<li>
                    <a class="link" rel="nofollow noopener noreferrer" href="___image_link___" >
                        <div>
                            <img class="img-fluid" src="___img_src___">
                            <div class="image_gallery_title">___image_title___</div>
                        </div>
                    </a>
                </li>`,
    },
    custom_fields: {
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        main: ` <div class="section qrc_calltoaction qr_cc_card">
                    ___header_html___
                    <ul class="qrc_custom_list_tow_col">
                        ___field_items___
                    </ul>
                </div>`,
        item_wrapper: ``,
        item: `<li>
                    <div class="qrc_custom_list_tow_col_1">___key___</div>
                    <div class="qrc_custom_list_tow_col_2">___val___</div>
                </li>`,
    },
    text_desc: {
        main: ` <div class="section qrc_heading_text qr_cc_card">___title_html___ ___desc_html___</div>`,
        title: `<h2>___title___</h2>`,
        desc: ` <p>___desc___</p>`,
    },
    coupon_code: {
        main: ` <div class="section qrc_coupon_code qr_cc_card">
                    <p>___title___</p>
                    <h2>___coupon_code___</h2>
                </div>`,
    },
    contact: {
        main: `<div class="section qrc_contact qr_cc_card">
                    ___contact_header_html___
                    ___contact_info_html___
                    ___floating_btn___
                </div>`,
        contact_header: {
            main: ` <div class="qrc_contact_header">
                        ___icon_img_html___
                        ___title_html___
                    </div>`,
            title: `<div class="qrc_contact_hdr_text">___title___</div>`,
            icon_img: `<div class="qrc_contact_hdr_img" style="background-image: url('___icon_img___');"></div>`,
        },
        floating_button: `<a  rel="nofollow noopener noreferrer" href="#" class="qrc_addtocontact">
                            <div class="qrc_addtocontact_text">___label___</div>
                            <div class="qrc_addtocontact_circle">
                                <span class="icon-add_1"></span>
                            </div>                
                        </a>`,
        number: `<div class="qrc_contact_info">
                        <div class="qrc_contact_info_title">___title___</div>
                        <div class="qrc_contact_number"><a href="tel:___number___">___number___</a></div>
                    </div>`,
        email: `<div class="qrc_email_info">
                    <div class="qrc_email_info_title">___title___</div>
                    <div class="qrc_email_id"><a href="mailto:___email___">___email___</a></div>
                </div>`,
        address: {
            action_button: `<a class="qrc_direction_btn" href="___btn_link___"  target="_blank"><span class="icon-direction_1"></span>___btn_label___</a>`,
            main: `<div class="qrc_address_info">
                        <div class="qrc_address_info_title">___title___</div>
                        <div class="qrc_address_text">___address___</div>
                        ___action_button___
                    </div>`,
        },
    },
    button: {
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        main: `<div class="section qrc_calltoaction qr_cc_card">
                ___header_html___
                ___button_html___
            </div>`,
        button: `<a rel="nofollow noopener noreferrer" href="___btn_link___" class="qrc_button"  target="_blank">___btn_label___</a>`,
    },
    video: {
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        main: `<div class="section qrc_video qr_cc_card">
                    ___header_html___
                    ___video_html___
                </div>`,
        video: `<div class="qrc_video_wrapper">
                    <iframe width="100%" height="203" src="___video_link___" title="video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="z-index: 999;-webkit-border-bottom-right-radius: 18px; -webkit-border-bottom-left-radius: 18px; -moz-border-radius-bottomright: 18px; -moz-border-radius-bottomleft: 18px; border-bottom-right-radius: 18px; border-bottom-left-radius: 18px; overflow: hidden;"></iframe>
                </div>`,
    },
    forms: {
        main: ` <div class="section qrc_gallery qrc_forms qr_cc_card">
                ___header_html___
                ___form_container___
            </div>`,
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        form_container: `<div class="qrc_form_container" >___form_steps___</div>`,
        form_step_wrapper: `<div class="qrc_form_step_wrapper" ___visibility___ id="___step_id___">___form_elements___ ___terms_checkbox___ ___submit_button___</div>`,
        form_field: `<div class="qrc_form_field" data-type="___type___" >
                        <div class="" style="margin-bottom:0.5em;">___label___</div>
                        ___form_field____
                    </div>`,
        submit_button: `<a rel="nofollow noopener noreferrer" href="#" class="qrc_button qrc_button_submit"  target="_blank">___btn_label___</a>`,
        terms_check_box: `<div class="qrc_terms"><input id="terms_check_box" class="" type="checkbox"><label for="terms_check_box">Agree to <a href="https://www.titaneyeplus.com/terms-and-conditions">Terms and Conditions<a/></label></div>`,
        text: `<input type="text" class="form-control">`,
        tel: `<input type="tel" class="form-control">`,
        number: `<input type="number" class="form-control">`,
        email: `<input type="text" class="form-control">`,
    },
    business_hours: {
        main: ` <div class="qr_cc_card business_hours_main">
                    <div class="qrc_business_hours_header">
                        ___pr_img_html___
                        <div class="business_header_content">
                            <div>
                                ___title_html___
                                ___status_html___
                            </div>
                            ___toggle_icon___
                        </div>
                    </div>
                    ___week_html___
                </div>`,
        title: `<div style="font-size:20px;color: var(--qrc-text-primary)">___title___</div>`,
        pr_img: `<div class="qrc_contact_hdr_img" style="background-image: url('___icon_img___');"></div>`,
        status: `<p style="color: var(--qrc-text-secondary)">___status___</p>`,
        toggle_icon: `<i class="icon-downarrow_4" onclick="if(typeof handleHoursToggle == 'function') return handleHoursToggle(this);" style="font-size:20px;font-weight:600; cursor:pointer"></i>`,
        week: `<div class="qrc_business_hours_body business_hours_hide">
                    ___day_html___
                </div>`,
        day: `<div class="day_section">
                    <div>___day___</div>
                    <div style="opacity:0.75;text-align:right">
                        <div>___first_timing___</div>
                        <div>___second_timimg___</div>
                    </div>
                </div>`
    },
    team: {
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        main: ` <div class="">
                    <div class="show_all_team_members">
                        ___field_items___
                    </div>
                </div>`,
        item_wrapper: ``,
        horizontal_line: `<hr width="30px" align="left">`,
        member_img: `<div class="qrc_team_img" style="background-image:url('___member_img___');"></div>`,
        item: `<div class="qr_cc_card member_section">
                ___header_html___
                    <div class="qrc_team_member">
                        ___member_img_html___
                        <div class="member_detail_section">
                            <div class="header_section_name">___name___</div>
                            <div>___designation___</div>
                            ___hr_line___
                            <div>___description___</div>
                        </div>
                    </div>
                </div>`,
    },
    testimonial: {
        header: `<div class="qrc_heading">___header_title___ ___header_desc___ </div>`,
        header_title: `<h2>___title___</h2>`,
        header_desc: `<p>___desc___</p>`,
        main: ` <div class="">
                    <div class="show_all_testimonial_members">
                        ___field_items___
                    </div>
                </div>`,
        item_wrapper: ``,
        member_img: `<div class="qrc_team_img" style="background-image:url('___member_img___');"></div>`,
        item: `<div class="qr_cc_card testimonial_section">
                ___header_html___
                    <div style="padding: 15px;display:flex;flex-direction:column;gap:20px">
                        <div class="testimonial_description" style="color: var(--qrc-text-secondary)">___description___</div>
                        <div class="qrc_testimonial_member">
                            ___member_img_html___
                            <div class="member_detail_section">
                                <div class="header_section_name">___name___</div>
                                <div>___designation___</div>
                            </div>
                        </div>
                    </div>
                </div>`,
    },
};

let defaultContentArray = {
    content: [{
            component: "profile",
            pr_img: "/images/digitalCard/profilepic.jpg",
            name: "Name",
            desc: "Title",
            company: "Company",
            contact_shortcut_enable: 1,
            contact_shortcuts: [{
                    type: "mobile",
                    value: ""
                },
                {
                    type: "email",
                    value: ""
                },
                {
                    type: "sms",
                    value: ""
                },
            ],
        },
        {
            component: "text_desc",
            title: "About Me",
            desc: "Description",
        },
        {
            component: "images",
            header_enable: 0,
            title: "",
            desc: "",
            view_type: "grid_2",
            images: [{
                    image: "/images/digitalCard/image_1.png",
                    title: "",
                    link: ""
                },
                {
                    image: "/images/digitalCard/image_2.png",
                    title: "",
                    link: ""
                }
            ],
        },
        {
            component: "social_link",
            header_enable: 0,
            title: "Social Links",
            desc: "Description",
            links: [{
                    type: "facebook",
                    url: "",
                    title: "Title",
                    subtitle: "Like us on Facebook",
                    subtitle_enable: 1,
                    icon_img: "/images/digitalCard/fb_icon@72x.png",
                },
                {
                    type: "instagram",
                    url: "",
                    title: "Instagram",
                    subtitle: "Follow us on Instagram",
                    subtitle_enable: 0,
                    icon_img: "/images/digitalCard/insta_icon@72x.png",
                },
                {
                    type: "twitter",
                    url: "",
                    title: "Twitter",
                    subtitle: "Talk with us on Twitter",
                    subtitle_enable: 0,
                    icon_img: "/images/digitalCard/tw_icon@72x.png",
                },
            ],
        },
        {
            component: "contact",
            contact_title: "Contact Us",
            icon_img: "/images/digitalCard/contactus.png",
            floating_button_enable: 1,
            floating_button_label: "Add to Contact",
            contact_infos: [{
                    type: "number",
                    title: "Call Us",
                    label: "Mobile ",
                    number: "123 456 7890",
                },
                {
                    type: "email",
                    title: "Email",
                    label: "Email ",
                    email: "contactme@domain.com",
                },
                {
                    type: "address",
                    title: "Address",
                    street: "817 N Ave",
                    city: "California",
                    country: "US",
                    state: "Chicago",
                    zip: "60622",
                    action_button_enable: 1,
                    action_button_label: "Direction",
                    action_button_link: "#",
                },
            ],
        },
        {
            component: "web_links",
            header_enable: 0,
            title: "Web Link",
            desc: "Description",
            links: [{
                url: "",
                title: "Portfolio",
                subtitle: "Visit for more information",
                subtitle_enable: 1,
                icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
            }, ],
        },
    ],
};

let DigitalBusinessPageTemplates = [{
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#210972",
            primary_profile_text_color: "#061244",
            primary_text_color: "#061244",
            secondary_bg_color: "#9380ff",
            secondary_profile_text_color: "#061244",
            secondary_text_color: "#76839B",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `body{overflow:auto !important;}
            .qrc_page_wrapper{height:unset; min-height:100vh;}
            @media (max-width: 767px) {
                body::-webkit-scrollbar { display: none;}
                body { -ms-overflow-style: none;  scrollbar-width: none;}
            }`,
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#000000",
            primary_profile_text_color: "#2F2F2F",
            primary_text_color: "#2F2F2F",
            secondary_bg_color: "#f6f6f6ff",
            secondary_profile_text_color: "#747474",
            secondary_text_color: "#747474",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `body{overflow:auto !important;}
            .qrc_page_wrapper{height:unset; min-height:100vh;}
            @media (max-width: 767px) {
                body::-webkit-scrollbar { display: none;}
                body { -ms-overflow-style: none;  scrollbar-width: none;}
            }`,
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#000000",
            primary_profile_text_color: "#2F2F2F",
            primary_text_color: "#2F2F2F",
            secondary_bg_color: "#f6f6f6ff",
            secondary_profile_text_color: "#747474",
            secondary_text_color: "#747474",
            bg_img: "/images/digitalCard/bg_page_1.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `body{overflow:auto !important;}
            .qrc_page_wrapper{height:unset; min-height:100vh;}
            @media (max-width: 767px) {
                body::-webkit-scrollbar { display: none;}
                body { -ms-overflow-style: none;  scrollbar-width: none;}
            }`,
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#000000",
            primary_profile_text_color: "#2F2F2F",
            primary_text_color: "#2F2F2F",
            secondary_bg_color: "#f6f6f6ff",
            secondary_profile_text_color: "#2F2F2F",
            secondary_text_color: "#747474",
            bg_img: "/images/digitalCard/bg/background_18.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `body{overflow:auto !important;}
            .qrc_page_wrapper{height:unset; min-height:100vh;}
            @media (max-width: 767px) {
                body::-webkit-scrollbar { display: none;}
                body { -ms-overflow-style: none;  scrollbar-width: none;}
            }`,
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#061244",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#061244",
            secondary_bg_color: "#a07ddaff",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#061244",
            bg_img: "/images/digitalCard/bg_page_1.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "0",
                border_radius: "8",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "0",
            },
            custom_css: `body{overflow:auto !important;}
            .qrc_page_wrapper{height:unset; min-height:100vh;}
            @media (max-width: 767px) {
                body::-webkit-scrollbar { display: none;}
                body { -ms-overflow-style: none;  scrollbar-width: none;}
            }`,
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#941700ff",
            primary_profile_text_color: "#061244",
            primary_text_color: "#061244",
            secondary_bg_color: "#ff7960",
            secondary_profile_text_color: "#061244",
            secondary_text_color: "#76839B",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `body{overflow:auto !important;}
            .qrc_page_wrapper{height:unset; min-height:100vh;}
            @media (max-width: 767px) {
                body::-webkit-scrollbar { display: none;}
                body { -ms-overflow-style: none;  scrollbar-width: none;}
            }`,
        },
        html: DefaultHtmlTemplate,
    },
];

const PetIdTagTemplates = [{
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/profile_pic.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
                enable_pr: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#85442d",
            primary_profile_text_color: "#85442d",
            primary_text_color: "#85442d",
            secondary_bg_color: "#FFE9A7",
            secondary_profile_text_color: "#676361",
            secondary_text_color: "#676361",
            bg_img: "/images/digitalCard/bg/pet_tag_bg_1.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_2.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#41B853",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#09270E",
            secondary_bg_color: "#41B853",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#777E78",
            bg_img: "/images/digitalCard/bg/pet_tag_bg_2.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/profile_pic.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#683B2B",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#0e781e",
            secondary_bg_color: "#683B2B",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#676361",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_4.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#000000",
            primary_profile_text_color: "#2F2F2F",
            primary_text_color: "#2F2F2F",
            secondary_bg_color: "#F8B4A9",
            secondary_profile_text_color: "#747474",
            secondary_text_color: "#747474",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_5.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#000000",
            primary_profile_text_color: "#000000",
            primary_text_color: "#000000",
            secondary_bg_color: "#000000",
            secondary_profile_text_color: "#000000",
            secondary_text_color: "#000000",
            bg_img: "/images/digitalCard/bg/background_10.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_6.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#000000",
            primary_profile_text_color: "#000000",
            primary_text_color: "#061244",
            secondary_bg_color: "#000000",
            secondary_profile_text_color: "#000000",
            secondary_text_color: "#000000",
            bg_img: "/images/digitalCard/bg/background_13.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_7.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#F2698E",
            primary_profile_text_color: "#FFFFFF",
            primary_text_color: "#F2698E",
            secondary_bg_color: "#F2698E",
            secondary_profile_text_color: "#FFFFFF",
            secondary_text_color: "#000000",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_8.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#9A4700",
            primary_profile_text_color: "#000000",
            primary_text_color: "#9A4700",
            secondary_bg_color: "#9A4700",
            secondary_profile_text_color: "#000000",
            secondary_text_color: "#000000",
            bg_img: "/images/digitalCard/bg/background_12.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_9.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#9A4700",
            primary_profile_text_color: "#FFFFFF",
            primary_text_color: "#9A4700",
            secondary_bg_color: "#7B4C01",
            secondary_profile_text_color: "#FFFFFF",
            secondary_text_color: "#000000",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_10.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#ED0B59",
            primary_profile_text_color: "#000000",
            primary_text_color: "#ED0B59",
            secondary_bg_color: "#ED0B59",
            secondary_profile_text_color: "#000000",
            secondary_text_color: "#000000",
            bg_img: "/images/digitalCard/bg/background_18.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/pet-tag/petid_temp_profile_11.png",
                name: "Pet Name",
                desc: "Breed",
                company: "Very friendly",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "email",
                        value: ""
                    },
                    {
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "location",
                        value: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "I am so cute...",
                card_enable: 1,
            },
            {
                component: "contact",
                contact_title: "Owner Info",
                icon_img: wrapperUrlWithCdn("/images/digitalCard/contactus.png"),
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "+1 9876543210",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Personal ",
                        email: "abc@xyz.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        building: "Building",
                        city: "City",
                        state: "State",
                        country: "Country",
                        zipcode: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
                card_enable: 1,
            },
            {
                component: "images",
                title: "Heading Text",
                desc: "Heading Description",
                view_type: "grid_1",
                images: [
                    wrapperUrlWithCdn("/images/petTag/dog_4.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_5.png"),
                    wrapperUrlWithCdn("/images/petTag/dog_3.png"),
                ],
                card_enable: 1,
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Other Information",
                desc: "",
                fields: [{
                        key: "Owner Name",
                        val: "Name"
                    },
                    {
                        key: "Vaccination Status",
                        val: "Yes"
                    },
                    {
                        key: "Vaccination Details",
                        val: "xxxxxxx"
                    },
                    {
                        key: "Microchipped",
                        val: "Yes"
                    },
                    {
                        key: "Spay/Neutered",
                        val: "Yes"
                    },
                    {
                        key: "Birthday",
                        val: ""
                    },
                    {
                        key: "Gender",
                        val: ""
                    },
                    {
                        key: "Color",
                        val: ""
                    },
                    {
                        key: "Coat",
                        val: ""
                    },
                    {
                        key: "Size",
                        val: ""
                    },
                    {
                        key: "Microchip ID",
                        val: ""
                    },
                    {
                        key: "Tail",
                        val: ""
                    },
                    {
                        key: "Ears",
                        val: ""
                    },
                    {
                        key: "Weight",
                        val: ""
                    },
                    {
                        key: "Weight scale",
                        val: ""
                    },
                    {
                        key: "Rabies Tag",
                        val: ""
                    },
                    {
                        key: "License",
                        val: ""
                    },
                ],
                card_enable: 1,
            },
            {
                component: "text_desc",
                title: "Behaviour",
                desc: "",
                card_enable: 1,
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Web Links",
                desc: "Description",
                links: [{
                    url: "https://www.yourdomain.com",
                    title: "URL",
                    subtitle: "Sub Title",
                    subtitle_enable: 1,
                    icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                }, ],
                card_enable: 1,
            },
            {
                component: "social_link",
                header_enable: 1,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Follow us on Facebook",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/fb_icon@72x.png"),
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn(
                            "/images/digitalCard/insta_icon@72x.png"
                        ),
                    },
                ],
                card_enable: 1,
            },
        ],
        style: {
            primary_bg_color: "#85D309",
            primary_profile_text_color: "#000000",
            primary_text_color: "#85D309",
            secondary_bg_color: "#85D309",
            secondary_profile_text_color: "#000000",
            secondary_text_color: "#000000",
            bg_img: "/images/digitalCard/bg/background_11.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
];
const MedicalAlertTemplates = [{
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_1.png",
                name: "Name",
                desc: "Description",
                company: "Extra Information",
                contact_shortcut_enable: 0,
                contact_shortcuts: [{
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "email",
                        value: ""
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Emergency Contacts",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "John Adam (Son)",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "number",
                        title: "Jenny Lopez (Family Physician)",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        city: "City",
                        country: "Country",
                        state: "State",
                        zip: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#0065c0",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#0065c0",
            secondary_bg_color: "#333333",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#333333",
            bg_img: "/images/defaultImages/medical-alerts/bg_medical_alert_1.png",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_2.png",
                name: "Elena Miller",
                desc: "",
                company: "Female",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#5ea5e6",
            primary_profile_text_color: "#2c5e81",
            primary_text_color: "#5ea5e6",
            secondary_bg_color: "#333333",
            secondary_profile_text_color: "#2c5e81",
            secondary_text_color: "#333333",
            bg_img: "/images/defaultImages/medical-alerts/bg_medical_alert_2.png",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_3.png",
                name: "William Miller",
                desc: "",
                company: "Male",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },

            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#0065c0",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#ffffff",
            secondary_bg_color: "#ffffff",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#ffffff",
            bg_img: "/images/defaultImages/medical-alerts/bg_medical_alert_2.png",
            card: {
                bg_color: "#12225a",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_4.png",
                name: "William Miller",
                desc: "",
                company: "Male",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },

            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#00D5FF",
            primary_profile_text_color: "#061244",
            primary_text_color: "#061244",
            secondary_bg_color: "#ffffff",
            secondary_profile_text_color: "#061244",
            secondary_text_color: "#517AFA",
            bg_img: "/images/defaultImages/medical-alerts/bg_m_temp_4.png",
            card: {
                bg_color: "#fff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_5.png",
                name: "William Miller",
                desc: "",
                company: "Male",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },

            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#F2698E",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#061244",
            secondary_bg_color: "#F2698E",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#061244",
            bg_img: "",
            card: {
                bg_color: "#fff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_6.png",
                name: "William Miller",
                desc: "",
                company: "Male",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },

            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#1C3496",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#517AFA",
            secondary_bg_color: "#1C3496",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#061244",
            bg_img: "/images/defaultImages/medical-alerts/bg_m_temp_6.png",
            card: {
                bg_color: "#fff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_7.png",
                name: "William Miller",
                desc: "",
                company: "Male",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },

            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#00D5FF",
            primary_profile_text_color: "#061244",
            primary_text_color: "#0C365C",
            secondary_bg_color: "#00D5FF",
            secondary_profile_text_color: "#061244",
            secondary_text_color: "#4195E2",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_8.png",
                name: "William Miller",
                desc: "",
                company: "Male",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },

            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#0065c0",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#0C365C",
            secondary_bg_color: "#ffffff",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#1B9CE9",
            bg_img: "/images/defaultImages/medical-alerts/bg_medical_alert_1.png",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_9.png",
                name: "William Miller",
                desc: "",
                company: "Male",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },

            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#FF862E",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#FF862E",
            secondary_bg_color: "#FFF8C3",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#583A24",
            bg_img: "",
            card: {
                bg_color: "#fff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/medical-alerts/m_alert_profile_10.png",
                name: "William Miller",
                desc: "",
                company: "Male",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "custom_fields",
                header_enable: 1,
                title: "Medical Emergency Information",
                desc: "",
                fields: [{
                        key: "Medical Conditions",
                        val: "Severe Asthmatic",
                    },
                    {
                        key: "Allergic To",
                        val: "Penicillin",
                    },
                    {
                        key: "Blood Group",
                        val: "O+",
                    },
                    {
                        key: "Height",
                        val: "166 CM",
                    },
                    {
                        key: "Vaccinations",
                        val: "Standard all done",
                    },
                ],
            },
            {
                component: "text_desc",
                title: "About Me",
                desc: "Description",
            },

            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#517AFA",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#517AFA",
            secondary_bg_color: "#7BE9FF",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#061244",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
];

const BusinessPageTemplates = [{
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/businesspage/b_brand_logo.png",
                name: "Name",
                desc: "Description",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "email",
                        value: ""
                    },
                    {
                        type: "sms",
                        value: ""
                    },
                ],
            },
            {
                component: 'images',
                header_enable: 0,
                title: '',
                desc: '',
                view_type: 'grid_2',
                images: [
                    '/images/digitalCard/image_1.png',
                    '/images/digitalCard/image_2.png'
                ]
            },
            // {
            //     component: "image_gallery",
            //     header_enable: 0,
            //     title: "",
            //     desc: "",
            //     view_type: "slider",
            //     images: [
            //         {
            //             image: "/images/digitalCard/image_1.png",
            //             title: "",
            //             link: ""
            //         },
            //         {
            //             image: "/images/digitalCard/image_2.png",
            //             title: "",
            //             link: ""
            //         },{
            //             image: "/images/digitalCard/image_1.png",
            //             title: "",
            //             link: ""
            //         }
            //     ],
            // },
            {
                component: "social_link",
                header_enable: 0,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Like us on Facebook",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/fb_icon@72x.png",
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 0,
                        icon_img: "/images/digitalCard/insta_icon@72x.png",
                    },
                    {
                        type: "twitter",
                        url: "",
                        title: "Twitter",
                        subtitle: "Talk with us on Twitter",
                        subtitle_enable: 0,
                        icon_img: "/images/digitalCard/tw_icon@72x.png",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Mobile",
                        label: "Mobile ",
                        number: "+91 0000000000",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        city: "City",
                        country: "Country",
                        state: "State",
                        zip: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
            {
                component: "business_hours",
                title: "Opening Hours",
                pr_img: "/images/defaultImages/businesspage/hours_img.png",
                open_24_enable: 0,
                open_24_status_text: "Open 24 Hrs",
                opening_status_text: "Open",
                closing_status_text: "Closed",
                week_days: {}
            },
            {
                component: "team",
                header_enable: 1,
                title: "",
                desc: "",
                fields: [{
                    name: "Name",
                    designation: "Designation",
                    description: "",
                    pr_img: "/images/defaultImages/businesspage/team_thumb_2.png",
                    enable_pr: 1
                }, ],
            },
            {
                component: "testimonial",
                header_enable: 1,
                title: "",
                desc: "",
                fields: [{
                    name: "Name",
                    designation: "Designation",
                    description: "",
                    pr_img: "/images/defaultImages/businesspage/testimonial_thumb.png",
                    enable_pr: 1
                }, ],
            },
        ],
        style: {
            primary_bg_color: "#926DF9",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#000000",
            secondary_bg_color: "#333333",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#000000",
            bg_img: "/images/defaultImages/businesspage/bt_cover_bg_1.png",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: ``
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/businesspage/b_brand_logo.png",
                name: "Name",
                desc: "Description",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "email",
                        value: ""
                    },
                    {
                        type: "sms",
                        value: ""
                    },
                ],
            },
            {
                component: 'images',
                header_enable: 0,
                title: '',
                desc: '',
                view_type: 'grid_2',
                images: [
                    '/images/digitalCard/image_1.png',
                    '/images/digitalCard/image_2.png'
                ]
            },
            // {
            //     component: "image_gallery",
            //     header_enable: 0,
            //     title: "",
            //     desc: "",
            //     view_type: "slider",
            //     images: [
            //         {
            //             image: "/images/digitalCard/image_1.png",
            //             title: "",
            //             link: ""
            //         },
            //         {
            //             image: "/images/digitalCard/image_2.png",
            //             title: "",
            //             link: ""
            //         },
            //         {
            //             image: "/images/digitalCard/image_1.png",
            //             title: "",
            //             link: ""
            //         }
            //     ],
            // },
            {
                component: "social_link",
                header_enable: 0,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Like us on Facebook",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/fb_icon@72x.png",
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 0,
                        icon_img: "/images/digitalCard/insta_icon@72x.png",
                    },
                    {
                        type: "twitter",
                        url: "",
                        title: "Twitter",
                        subtitle: "Talk with us on Twitter",
                        subtitle_enable: 0,
                        icon_img: "/images/digitalCard/tw_icon@72x.png",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Mobile",
                        label: "Mobile ",
                        number: "+91 0000000000",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        city: "City",
                        country: "Country",
                        state: "State",
                        zip: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
            {
                component: "business_hours",
                title: "Opening Hours",
                pr_img: "/images/defaultImages/businesspage/hours_img.png",
                open_24_enable: 0,
                open_24_status_text: "Open 24 Hrs",
                opening_status_text: "Open",
                closing_status_text: "Closed",
                week_days: {}
            },
            {
                component: "team",
                header_enable: 1,
                title: "",
                desc: "",
                fields: [{
                    name: "Name",
                    designation: "Designation",
                    description: "",
                    pr_img: "/images/defaultImages/businesspage/team_thumb_2.png",
                    enable_pr: 1
                }, ],
            },
            {
                component: "testimonial",
                header_enable: 1,
                title: "",
                desc: "",
                fields: [{
                    name: "Name",
                    designation: "Designation",
                    description: "",
                    pr_img: "/images/defaultImages/businesspage/testimonial_thumb.png",
                    enable_pr: 1
                }, ],
            },
        ],
        style: {
            primary_bg_color: "#FF9553",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#FF6200",
            secondary_bg_color: "#333333",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#000000",
            bg_img: "/images/defaultImages/businesspage/bt_cover_bg_1.png",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `.qrc_profile_2{padding:10px 0 10px 0}
            .qrc_profile_2 .qrc_profilepic{position:static}
            .qrc_profile_2 .qrc_profile_inner{padding-top:0}
            .qrc_profile_2 .qrc_profilepic{width:78px;min-width:78px;height:78px}
            .qrc_profile_inner{display:flex;text-align:left;gap:15px}
            .qrc_name_desc_inner{display:flex;flex-direction:column;justify-content:center}
            .qrc_profilepic{margin:0}
            .qrc_profile h2{font-size:26px;margin-top:0;word-break:break-all;}
            .qrc_profile p{font-size:18px;word-break:break-all;}`
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                <div class="qrc_name_desc_inner">
                                    ___name_html___
                                    ___desc_html___
                                    ___company_html___
                                </div>
                            </div>
                                ___shortcut_html___
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/businesspage/b_brand_logo.png",
                name: "Name",
                desc: "Description",
                contact_shortcut_enable: 1,
                contact_shortcuts: [{
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "email",
                        value: ""
                    },
                    {
                        type: "sms",
                        value: ""
                    },
                ],
            },
            {
                component: 'images',
                header_enable: 0,
                title: '',
                desc: '',
                view_type: 'grid_2',
                images: [
                    '/images/digitalCard/image_1.png',
                    '/images/digitalCard/image_2.png'
                ]
            },
            // {
            //     component: "image_gallery",
            //     header_enable: 0,
            //     title: "",
            //     desc: "",
            //     view_type: "slider",
            //     images: [
            //         {
            //             image: "/images/digitalCard/image_1.png",
            //             title: "",
            //             link: ""
            //         },
            //         {
            //             image: "/images/digitalCard/image_2.png",
            //             title: "",
            //             link: ""
            //         },
            //         {
            //             image: "/images/digitalCard/image_1.png",
            //             title: "",
            //             link: ""
            //         }
            //     ],
            // },
            {
                component: "social_link",
                header_enable: 0,
                title: "Social Links",
                desc: "Description",
                links: [{
                        type: "facebook",
                        url: "",
                        title: "Facebook",
                        subtitle: "Like us on Facebook",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/fb_icon@72x.png",
                    },
                    {
                        type: "instagram",
                        url: "",
                        title: "Instagram",
                        subtitle: "Follow us on Instagram",
                        subtitle_enable: 0,
                        icon_img: "/images/digitalCard/insta_icon@72x.png",
                    },
                    {
                        type: "twitter",
                        url: "",
                        title: "Twitter",
                        subtitle: "Talk with us on Twitter",
                        subtitle_enable: 0,
                        icon_img: "/images/digitalCard/tw_icon@72x.png",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Mobile",
                        label: "Mobile ",
                        number: "+91 0000000000",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        city: "City",
                        country: "Country",
                        state: "State",
                        zip: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
            {
                component: "business_hours",
                title: "Opening Hours",
                pr_img: "/images/defaultImages/businesspage/hours_img.png",
                open_24_enable: 0,
                open_24_status_text: "Open 24 Hrs",
                opening_status_text: "Open",
                closing_status_text: "Closed",
                week_days: {}
            },
            {
                component: "team",
                header_enable: 1,
                title: "",
                desc: "",
                fields: [{
                    name: "Name",
                    designation: "Designation",
                    description: "",
                    pr_img: "/images/defaultImages/businesspage/team_thumb_2.png",
                    enable_pr: 1
                }, ],
            },
            {
                component: "testimonial",
                header_enable: 1,
                title: "",
                desc: "",
                fields: [{
                    name: "Name",
                    designation: "Designation",
                    description: "",
                    pr_img: "/images/defaultImages/businesspage/testimonial_thumb.png",
                    enable_pr: 1
                }, ],
            },
        ],
        style: {
            primary_bg_color: "#154086",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#000000",
            secondary_bg_color: "#333333",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#000000",
            bg_img: "/images/defaultImages/businesspage/bt_background_3.png",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
];

const MultiURLTemplates = [{
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/multi-url/icon_2.png",
                name: "Name",
                desc: "Description",
                company: "Extra Information",
                contact_shortcut_enable: 0,
                contact_shortcuts: [{
                        type: "mobile",
                        value: ""
                    },
                    {
                        type: "email",
                        value: ""
                    },
                ],
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Title",
                desc: "Description",
                links: [{
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                    },
                    {
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                card_enable: 0,
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "Street",
                        city: "City",
                        country: "Country",
                        state: "State",
                        zip: "Zipcode",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#517afa",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#517afa",
            secondary_bg_color: "#333333",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#333333",
            bg_img: "/images/digitalCard/bg/background_16.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/multi-url/ml_link_profile_2.png",
                name: "Name",
                desc: "Description",
                card_enable: 0,
                company: "Extra Info",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Title",
                desc: "Description",
                links: [{
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                    },
                    {
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: wrapperUrlWithCdn("/images/digitalCard/weblink.png"),
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                card_enable: 0,
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#f43971",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#f43971",
            secondary_bg_color: "#fe97b6 ",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#333333",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/multi-url/ml_link_profile_3.png",
                name: "Name",
                desc: "Description",
                card_enable: 0,
                company: "Extra Info",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Title",
                desc: "Description",
                links: [{
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/weblink.png",
                    },
                    {
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/weblink.png",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                card_enable: 0,
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#FF8F03",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#ffffff",
            secondary_bg_color: "#f7b701 ",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#ffffff",
            bg_img: "",
            card: {
                bg_color: "#21274e",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/multi-url/ml_link_profile_4.png",
                name: "Name",
                desc: "Description",
                card_enable: 0,
                company: "Extra Info",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Title",
                desc: "Description",
                links: [{
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/weblink.png",
                    },
                    {
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/weblink.png",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                card_enable: 0,
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#21274e",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#21274e",
            secondary_bg_color: "#f7b701 ",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#21274e",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/defaultImages/multi-url/ml_link_profile_5.png",
                name: "Name",
                desc: "Description",
                card_enable: 0,
                company: "Extra Info",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Title",
                desc: "Description",
                links: [{
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/weblink.png",
                    },
                    {
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/weblink.png",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                card_enable: 0,
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#ce7240",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#ce7240",
            secondary_bg_color: "#333333 ",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#333333",
            bg_img: "/images/digitalCard/bg/background_9.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a  rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: [{
                component: "profile",
                pr_img: "/images/digitalCard/bg/ml_link_profile_background_6.png",
                br_img: "/images/defaultImages/multi-url/ml_link_profile_6.png",
                pr_img_label: "(380x475px, 4:5 Ratio)",
                br_img_label: "(120x120px, 1:1 Ratio)",
                remove_only_pr_img: 1,
                show_brand_img: 1,
                enable_br: 1,
                enable_pr: 1,
                name: "Name",
                desc: "Description",
                card_enable: 0,
                company: "Extra Info",
                contact_shortcut_enable: 0,
                contact_shortcuts: [],
            },
            {
                component: "web_links",
                header_enable: 1,
                title: "Title",
                desc: "Description",
                links: [{
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/weblink.png",
                    },
                    {
                        url: "https://www.yourdomain.com",
                        title: "Title",
                        subtitle: "Visit for more information",
                        subtitle_enable: 1,
                        icon_img: "/images/digitalCard/weblink.png",
                    },
                ],
            },
            {
                component: "contact",
                contact_title: "Contact Us",
                card_enable: 0,
                icon_img: "/images/digitalCard/contactus.png",
                floating_button_enable: 1,
                floating_button_label: "Add to Contact",
                contact_infos: [{
                        type: "number",
                        title: "Call Us",
                        label: "Mobile ",
                        number: "123 456 7890",
                    },
                    {
                        type: "email",
                        title: "Email",
                        label: "Email ",
                        email: "contactme@domain.com",
                    },
                    {
                        type: "address",
                        title: "Address",
                        street: "817 N Ave",
                        city: "California",
                        country: "US",
                        state: "Chicago",
                        zip: "60622",
                        action_button_enable: 1,
                        action_button_label: "Direction",
                        action_button_link: "#",
                    },
                ],
            },
        ],
        style: {
            primary_bg_color: "#333333",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#000000",
            secondary_bg_color: "#000000 ",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#333333",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `
                body{overflow:auto !important;}
                 .qrc_profile_5{background-color: var(--qrc-secondary); border-radius: 18px; overflow: hidden; margin: 15px 0;}
                 .qrc_profile_5 h2{ color: var(--qrc-profile-primary); font-size: 32px; line-height:34px; word-break: break-word; font-weight: normal;}
                 .qrc_profile_5 p{color: var(--qrc-profile-secondary);}
                 .qrc_profile_5 .qrc_profile_inner{ padding-top: 0; position: relative; padding-bottom: 15px; background: var(--qrc-secondary);}
                 .qrc_profile_5 .qrc_profilepic{height: 380px; width: 100%; border-radius: 0; position: relative;}
                 .qrc_profile_5_svg{position: absolute; bottom:-1px;  text-shadow: 2px 2px 3px rgba(0,0,0,0.3); margin-right:-1px;}
                 .qrc_profile_5_ovrlay_svg{position: absolute; bottom:0px; opacity: 0.7; }
                 .qrc_profile_5 .qrc_profile_inner_info{margin-top:40px;}
                 .qrc_profilepic{background-position: top center; }
                 .qrc_heading h2{font-weight: normal;}
                 .qrc_profile_shortcut ul li{text-align: center; background: var(--qrc-primary); color: #fff;width: 52px;
                     height: 52px;
                     font-size: 28px;
                     padding-top: 0px;     margin-bottom: 8px;}
                 .qrc_profile_shortcut ul li a{color: #fff;}
                 .qrc_profile_shortcut ul li a:hover{color: #fff;}
                 .qrc_gallery_list li{padding-top: 0px;}
                 .qrc_page_wrapper{background-position: top center; background-size: cover;height:unset; min-height:100vh;}
                 .qrc_profile_brand_logo{ background:#fff; position: absolute; left: 15px; top: 298px; border: solid 3px #00000010; border-radius: 100px; width: 110px; height: 110px; margin: auto; text-align: center; vertical-align: middle; display: flex; align-items: center; overflow: hidden;}
                 .qrc_profile_brand_logo img{max-width: 100%; max-height: 100%;}
                 .qrc_profile_shortcut{margin: 15px 0 0 0;}
                 .qrc_page_inner{padding-top:0}
                 
                 @media (max-width: 767px) {
                     .qrc_profile_5 {margin: 0 -15px; border-radius: 0px !important; margin-top:0; margin-bottom: 0px;}
                     body::-webkit-scrollbar { display: none;}
                     body { -ms-overflow-style: none;  scrollbar-width: none;}
                 }        
             `,
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile_5">                         
                <div class="qrc_profile_inner">
                    ___pr_pic___
                    <div class="qrc_profile_inner_info">
                       ___name_html___
                       ___desc_html___
                       ___company_html___
                       ___shortcut_html___
                    </div>                                
                </div>
                ___br_img_html___
            </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                    <ul>___shortcut_items___</ul>
                </div>`,
                item: '<li class="qr_cc_card"><a href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `
            <div class="qrc_profilepic" style="background-image: url('___pr_img___');">
                    <svg id="Layer_1" class="qrc_profile_5_ovrlay_svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 375 300">
                    <defs>
                        <style>
                        .cls-1 {
                            fill: url(#linear-gradient);
                        }
                        </style>
                        <linearGradient id="linear-gradient" x1="1.06" y1="260.32" x2="1.06" y2="259.32" gradientTransform="translate(-208.5 67424) scale(375 -259)" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#070708" stop-opacity="0"/>
                        <stop offset="1" stop-color="#070708"/>
                        </linearGradient>
                    </defs>
                    <rect id="Rectangle_297" data-name="Rectangle 297" class="cls-1" width="375" height="300"/>
                </svg>

                <!-- shape svg -->
                <svg class="qrc_profile_5_svg" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 117"><defs><style>.cls-3{fill:var(--qrc-secondary);}.cls-2{opacity:.7;}</style></defs><g id="Group_1240" class="cls-2">
                <path id="Path_1471" class="cls-3" d="M.08,81.65l3.11-3.68,3.99,1.3,3.79-2.06,5.68,1.13s.42-.6,2.73,1.42,2.1,3.39,3.99,1.85,3.15-3.23,4.41-1.78c1.26,1.45,6.31,3.2,6.31,3.2l1.89-.19,7.15-2.5,4.42-2.68s0-.22,1.47-.14c1.47,.08,6.52-3.11,6.73-3.8s1.05-.1,2.73,1.3,7.15,.42,9.04-1.11,3.79-3.29,4.63-2.7,2.73-1.39,4.41-2.45,4.62-3.15,5.47-1.43,5.47,.36,5.47,.36v-1.66s4.2,3.73,5.26,4.07,9.46,4.91,10.3,4.61c.83-.42,1.6-.95,2.31-1.57v1.8s3.79,2.55,5.05,2.2,7.78,1.48,7.78,1.48c.66-.34,1.41-.41,2.1-.21,1.26,.33,3.79,2,5.05,.47s7.15,.36,7.15,1.04,10.51,1.89,12.61,.34,3.36,1.24,3.36,1.24c0,0,8.83,.71,9.67,.4s5.88-4.62,8.2-3.95c2.08,.71,4.12,1.57,6.1,2.57,2.61-1.78,5.56-2.92,8.62-3.33,4.63-.45,11.14-6.25,13.67-8.07,2.52-1.82,7.99-5.72,10.3-5.95,2.31-.23,13.26-7.82,15.14-10.11,2.31-2.83,9.88-4.24,11.98-5.79s4.42-3.8,5.05-2.51,9.25-2.7,11.98-4.32c2.73-1.61,5.88,3.02,8.83,3.63s13.03-1.27,15.35-2.17,9.67-2.74,11.35-.21c1.68,2.53,10.09,5.3,10.93,5.22s16.19-.01,18.08-1.09c1.89-1.08,9.46-6.83,11.57-3.97s11.77,3.93,13.03,3.14,6.94-.68,8.83,.48,10.3,2.81,10.3,2.81c0,0-.84,.55,1.47-2.38s2.1-3.81,3.79-2.4c2.08,2.08,4.04,4.29,5.88,6.61l6.26,.29V117.73L.08,117.35v-35.7Z"/></g><g id="Group_1240-2"><path id="Path_1471-2" class="cls-3" d="M.08,83.43l3.11-3.4,3.99,1.27,3.79-1.87,5.68,1.14s.42-.56,2.73,1.37c2.31,1.92,2.1,3.2,3.99,1.79s3.15-2.98,4.41-1.6,6.31,3.09,6.31,3.09l1.89-.15,7.15-2.23,4.42-2.44s0-.21,1.47-.11c1.47,.1,6.52-2.81,6.73-3.46s1.05-.08,2.73,1.26,7.15,.5,9.04-.9,3.79-3.02,4.63-2.46,2.73-1.26,4.41-2.23,4.62-2.88,5.47-1.26,5.47,.42,5.47,.42v-1.56s4.2,3.55,5.26,3.89,9.46,4.74,10.3,4.46c.83-.38,1.6-.87,2.31-1.44v1.68s3.79,2.44,5.05,2.13,7.78,1.5,7.78,1.5c.66-.31,1.41-.37,2.1-.16,1.26,.32,3.79,1.93,5.05,.51s7.15,.44,7.15,1.07,10.51,1.92,12.61,.5,3.36,1.21,3.36,1.21c0,0,8.83,.8,9.67,.52s5.88-4.24,8.2-3.57c2.08,.7,4.12,1.53,6.1,2.49,2.61-1.63,5.56-2.65,8.62-2.99,4.63-.36,11.14-5.69,13.67-7.36,2.52-1.67,7.99-5.24,10.3-5.42s13.26-7.13,15.14-9.24c2.31-2.61,9.88-3.83,11.98-5.25s4.42-3.49,5.05-2.28,9.25-2.39,11.98-3.86,5.88,2.91,8.83,3.53c2.95,.61,13.03-1,15.35-1.81s9.67-2.43,11.35-.03c1.68,2.39,10.09,5.11,10.93,5.05s16.19,.23,18.08-.76,9.46-6.25,11.57-3.55,11.77,3.86,13.03,3.13,6.94-.53,8.83,.58c1.89,1.12,10.3,2.78,10.3,2.78,0,0-.84,.5,1.47-2.21s2.1-3.53,3.79-2.19c2.08,1.98,4.04,4.08,5.88,6.27l6.26,.36v57.43L.08,116.86v-33.43Z"/>
                </g>
                </svg>

            </div>`,
                br_img: `<div class="qrc_profile_brand_logo"> <img src="___br_img___"/> </div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
];

const EventTicketTemplates = [{
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#85442d",
            primary_profile_text_color: "#85442d",
            primary_text_color: "#85442d",
            secondary_bg_color: "#FFE9A7",
            secondary_profile_text_color: "#676361",
            secondary_text_color: "#676361",
            bg_img: "/images/digitalCard/bg/event_ticket_background_1.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#000000",
            primary_profile_text_color: "#000000",
            primary_text_color: "#09270E",
            secondary_bg_color: "#000000",
            secondary_profile_text_color: "#000000",
            secondary_text_color: "#777E78",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#FF8F03",
            primary_profile_text_color: "#3B3106",
            primary_text_color: "#3B3106",
            secondary_bg_color: "#FFEEA2",
            secondary_profile_text_color: "#5C5A53",
            secondary_text_color: "#5C5A53",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
];

const CouponCodeTemplates = [{
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#061244",
            primary_profile_text_color: "#061244",
            primary_text_color: "#061244",
            secondary_bg_color: "#061244",
            secondary_profile_text_color: "#061244",
            secondary_text_color: "#061244",
            bg_img: "/images/digitalCard/bg/coupon_background_1.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `.qrc_page_wrapper{background-position: center top;}`,
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#FF8F03",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#333333",
            secondary_bg_color: "#e6ff47ff",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#FF8F03",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: "",
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            coupon_code: DefaultHtmlTemplate.coupon_code,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#683B2B",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#0e781e",
            secondary_bg_color: "#683B2B",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#676361",
            bg_img: "/images/digitalCard/bg/coupon_background_2.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: `.qrc_page_wrapper{background-position: center top;}`,
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#000000",
            primary_profile_text_color: "#2F2F2F",
            primary_text_color: "#2F2F2F",
            secondary_bg_color: "#F8B4A9",
            secondary_profile_text_color: "#747474",
            secondary_text_color: "#747474",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
];

const PDFGalleryTemplates = [{
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#061244",
            primary_profile_text_color: "#061244",
            primary_text_color: "#061244",
            secondary_bg_color: "#061244",
            secondary_profile_text_color: "#061244",
            secondary_text_color: "#061244",
            bg_img: "/images/digitalCard/bg_page_1.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#517AFA",
            primary_profile_text_color: "#ffffff",
            primary_text_color: "#061244",
            secondary_bg_color: "#243272ff",
            secondary_profile_text_color: "#ffffff",
            secondary_text_color: "#76839B",
            bg_img: "/images/digitalCard/bg/background_16.jpg",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
            custom_css: "",
        },
        html: {
            profile: {
                main: `<div class="section qrc_profile qrc_profile_2">
                            <div class="qrc_profile_inner">
                                ___pr_img_html___
                                ___name_html___
                                ___desc_html___
                                ___company_html___
                                ___shortcut_html___
                            </div>
                        </div>`,
                name: `<h2>___name___</h2>`,
                desc: `<p>___desc___</p>`,
                company: `<p><strong>___company___</strong></p>`,
                shortcut: `<div class="qrc_profile_shortcut">
                                <ul>___shortcut_items___</ul>
                            </div>`,
                item: '<li class="qr_cc_card"><a rel="nofollow noopener noreferrer" href="___item_link___"><span class="___item_icon___"></span></a></li>',
                pr_img: `<div class="qrc_profilepic" style="background-image: url('___pr_img___');"></div>`,
            },
            social_link: DefaultHtmlTemplate.social_link,
            web_links: DefaultHtmlTemplate.web_links,
            text_desc: DefaultHtmlTemplate.text_desc,
            contact: DefaultHtmlTemplate.contact,
            button: DefaultHtmlTemplate.button,
            video: DefaultHtmlTemplate.video,
            custom_fields: DefaultHtmlTemplate.custom_fields,
            pdf_gallery: DefaultHtmlTemplate.pdf_gallery,
        },
    },
];

const FormTemplates = [{
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#061244",
            primary_profile_text_color: "#061244",
            primary_text_color: "#061244",
            secondary_bg_color: "#f3f768",
            secondary_profile_text_color: "#333333",
            secondary_text_color: "#333333",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
    {
        content: defaultContentArray.content,
        style: {
            primary_bg_color: "#061244",
            primary_profile_text_color: "#061244",
            primary_text_color: "#061244",
            secondary_bg_color: "#fd4500",
            secondary_profile_text_color: "#333333",
            secondary_text_color: "#333333",
            bg_img: "",
            card: {
                bg_color: "#ffffff",
                blur: "29",
                border_radius: "16",
                enable: 1,
                shadow_color: "#64646f33",
                spread: "0",
                x: "0",
                y: "7",
            },
        },
        html: DefaultHtmlTemplate,
    },
];

function triggerSocialUrlClicked(el) {
    let hrefStr = $(el).attr("href");
    //alert(hrefStr);
    if (
        hrefStr.toLowerCase().indexOf("weixin://dl/chat?") == 0 ||
        hrefStr.toLowerCase().indexOf("https://wechat.com/u/") == 0
    ) {
        let id = hrefStr
            .replace(/weixin:\/\/dl\/chat\?/i, "")
            .replace(/https:\/\/wechat.com\/u\//i, "");
        if (1) {
            //!navigator.clipboard) {
            fallbackCopyTextToClipboard(id, false);
            alert(`WeChat ID copied to the clipboard. Please open the WeChat app and paste it in "Add Contacts"
            
微信链接已经复制到剪贴板。请打开微信客户端并在“搜索“或”添加朋友”中粘贴。`);
            return false;
        }
        navigator.clipboard.writeText(id).then(function() {
            alert(`WeChat ID copied to the clipboard. \nPlease open the WeChat app and paste it in "Add Contacts"

微信链接已经复制到剪贴板。请打开微信客户端并在“搜索“或”添加朋友”中粘贴。`);
            window.open($(el).attr('href'), '_blank').focus();
            return true;
        }, function(err) {
            console.log('triggerSocialUrlClicked: Could not copy text: ', err);
        });

        return false;
    }
    return true;
}

function checkAndValidateImgURL(url) {
    if (url == location.href) {
        url = "";
    }

    return url;
}

if (typeof __page_type == "undefined") {
    __page_type = "";
}
if (isComponentBasedUI() || page == "displayPage") {
    if (typeof __savedQrCodeParams == "undefined") {
        __savedQrCodeParams = {};
    }
    if (
        extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
        "digital-business-card"
    ) {
        exponentialBackoff(
            () => {
                return typeof DBC_Templates != "undefined";
            },
            30,
            500,
            () => {
                QRPageComponents.init();
            }
        );
    } else if (
        extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
        "digital-business-cards"
    ) {
        exponentialBackoff(
            () => {
                return typeof DBCv2_Templates != "undefined";
            },
            30,
            500,
            () => {
                QRPageComponents.init();
            }
        );
    } else if (
        extractDataFromArray(__savedQrCodeParams, ["page"], __page_type) ==
        "businesspage"
    ) {
        exponentialBackoff(
            () => {
                return typeof BusinessPageTemplates != "undefined";
            },
            30,
            500,
            () => {
                QRPageComponents.init();
            }
        );
    } else {
        QRPageComponents.init();
    }
}