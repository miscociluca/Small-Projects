﻿function UpdateAvatar($data) {

    var form = $("<form/>",
                    {
                        id: "update_avatar"
                    });

    var fieldset = "" +
        '<div class="form_block form-horizontal">' +
        // Image
        '<div class="form-group">' +
        '<label class="col-sm-3 control-label">' +
        $data.label.LabelImage +
        "</label>" +
        '<div class="col-sm-9 small_btn_file icon_import">' +
        '<span class="btn btn-default btn-file">' +
        '<i class="fa fa-cloud-upload" aria-hidden="true"></i> ' + $data.label.LabelImage +
        '<input type="file" name="Avatar" id="Avatar" data-error="#errorExtension" />' +
        '</span>' +
        '<div id="errorExtension"></div>' +
        "</div>" +
        "</div>" +
        "</div>";
    form.append(fieldset);

    $.showPageDialog($data.dialodTitle,
        form,
        {
            "close": {
                text: $data.dialogButtons.cancel,
                'class': 'btn btn_cancel',
                click: function () {
                    $(this).dialog("close");
                }
            },
            "ok": {
                text: $data.dialogButtons.save,
                type: "submit",
                'class': 'btn btn_save',
                click: function () {
                    if ($('#update_avatar').valid()) {
                        $this = $(this);

                        var $this = $(this),
                            file = document.getElementById('Avatar'),
                            model = new FormData();

                        console.log($data.data)

                        model.append('Id', $data.data.Id);
                        model.append('Avatar', file.files[0]);

                        $.ajax({
                            url: $data.postAction,
                            type: 'POST',
                            data: model,
                            processData: false,
                            contentType: false,
                            beforeSend: function () {
                                $.SavingPopup();
                            },
                            success: function (data) {
                                if (data.status === 'OK') {
                                    var record = data.data;
                                    $($this).dialog('close');

                                    $('#avatarImgLeft').attr("src", $data.avatarImageUrl);
                                    $('#avatarImg').attr("src", $data.avatarImageUrl);

                                    // success system notify
                                    $.Notify({
                                        caption: $data.notify.title,
                                        content: $data.notify.contentSuccess,
                                        type: 'success'
                                    });
                                    console.log("Avatar was was added");
                                } else {
                                    $($this).dialog('close');
                                    // error system notify
                                    $.Notify({
                                        caption: $data.notify.title,
                                        content: $data.notify.contentError,
                                        type: 'alert'
                                    });
                                }
                            }
                        });
                    }
                }
            }
        },
        "update_avatar_dialog"
    );

    // preview image icon after upload
    if (window.File && window.FileList && window.FileReader) {
        $("#Avatar").on("change", function (e) {
            $('.loading_img').remove();
            var files = e.target.files,
              filesLength = files.length;
            $(".image_icon_preview").remove();
            $(".icon_import").append('<div class="loading_img"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>');
            for (var i = 0; i < filesLength; i++) {
                var f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function (e) {
                    var file = e.target;
                    var fileExt = f.name.match(/\.(.+)$/)[1];
                    var acceptedExtension = ['jpg', 'jpeg', 'png'];

                    if ($.inArray(fileExt, acceptedExtension) != -1) {
                        $(".icon_import").append('<div class="image_icon_preview">' +
                          '<img class="imageThumb" src="' + e.target.result + '" title="' + file.name + '" />' +
                          '<span class="remove"><i class="fa fa-times" aria-hidden="true"></i></span>' +
                          '</div>');

                        $('#errorExtension .error').remove();

                        $(".remove").click(function () {
                            $(this).parent(".image_icon_preview").remove();
                            $("#Avatar").val("");
                        });
                        if ($('.image_icon_preview').length > 0) {
                            $('.loading_img').remove();
                        };
                    }

                    $('.loading_img').remove();
                });
                fileReader.readAsDataURL(f);
            }
        });
    }
    else {
        console.log("Your browser doesn't support to File API")
    }

    $("#update_avatar")
        .validate({
            rules: {
                Avatar: {
                    required: true,
                    extension: "jpg|JPG|jpeg|JPEG|png|PNG"
                }
            },
            messages: {
                Avatar: {
                    required: $data.validateMessage.Image,
                    extension: $data.validateMessage.Extension
                }
            },
            errorPlacement: function (error, element) {
                var placement = $(element).data('error');
                if (placement) {
                    $(placement).append(error)
                } else {
                    error.insertAfter(element);
                }
            }
        });
}
