﻿function DeleteIconDialog($data) {

    var message = $("<p/>",
                    {
                        text: $data.message + ' "' + $data.datas.Name + '?'
                    });

    $.showPageDialog($data.dialodTitle,
        message,
        {
            "close": {
                text: $data.dialogButtons.cancel,
                'class': 'btn btn_cancel',
                click: function () {
                    $(this).dialog("close");
                }
            },
            "ok": {
                text: $data.dialogButtons.ok,
                type: "submit",
                'class': 'btn btn_save',
                click: function () {
                    var $this = $(this);
                    var data = $data.datas;
                    data.IsDeleted = true;

                    $.ajax({
                        url: $data.postAction,
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(data),
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {
                            $.SavingPopup();
                        },
                        success: function (data) {
                            if (data.status === 'OK') {
                                $data.row.remove().draw(false);
                                $($this).dialog('close');
                                // success system notify
                                $.Notify({
                                    caption: $data.notify.title,
                                    content: $data.notify.contentSuccess,
                                    type: 'success'
                                });
                                console.log('Icon successfull delete');
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
        },
        "delete_setting_dialog"
    );
}
