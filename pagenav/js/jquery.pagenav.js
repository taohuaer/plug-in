/*
分页
author:夏珂
email:250857316@qq.com
*/
(function ($, undefined) {
    $.PageNavObject = function (options, element) {

        this.$el = $(element);

        this._init(options);

    };

    $.PageNavObject.defaults = {
        start: 1,
        page: 1,
        count: 1,
        showpagenum: 10,
        container: {
            lastpagenum: false,  //显示最后一个页码
            jump: false, //跳转
            lastpage: {
                enable: false,
                text: "最后一页"
            } //显示最后一页按钮
        },
        onChange: function (page) { return false; }
    };

    $.PageNavObject.prototype = {
        _init: function (options) {
            var opts = $.extend(true, {}, $.PageNavObject.defaults, options);
            var $self = this;
            $self.$el.off("click", ".pageNum");
            $self.$el.off("click", ".jump-btn");
            $self.$el.on("click", ".pageNum", function () {
                if (!$(this).is(".active")) {
                    var page = parseInt($(this).data("page"), 10);
                    $self._draw(page, opts);
                }

            });

            $self.$el.on("click", ".jump-btn", function () {
                var input = $(this).prev("input");
                var text = input.val();
                if (input) {
                    if (!text) {
                        input.focus();
                    } else {
                        if (isNaN(text)) {
                            input.select();
                            return false;
                        }
                        var page = parseInt(text, 10);
                        $self._draw(page, opts);
                        
                    }
                }
            });

            this._draw(opts.start, opts);
        },

        _draw: function (page, options) {

            var pages = options.count,
                prev = page - 1,
                next = page + 1,
                showpagenum = //显示的页数
                    (options.showpagenum > pages ? pages : options.showpagenum) //总页数是否大于要显示的页数
                    - 1 //减掉第一页码
                    - (options.container.lastpagenum ? 1 : 0);//减掉最后一页码
            if (pages == 1) {
                options.onChange(page);
                this.$el.empty();
                return false;
            }
            if (page <= 0 || page > pages) {
                this.$el.find(".jump").find("input").select();
                return false;
            }

            this.$el.empty();

            if (pages <= 0) {
                return false;
            }
            var container = $("<ul></ul>"),
                prevcontainer, nextcontainer, pagecontainer = [], startspacescontainer,endspacescontainer, lastpagenumcontainer, lastpagecontainer,
                firstpagecontainer = $("<li class=\"pageNum\" data-page=\"1\"><a>1</a></li>"),
                jumpcontainer = $("<li class=\"jump\">跳转到 : </li>"),
                jumptext = $("<input type=\"text\" />"),
                jumpbutton = $("<button class=\"jump-btn\">GO</button>");

            
            this._insert(this.$el, container);

            if (page == 1) {
                firstpagecontainer.addClass("active");
            }
            if (pages > options.showpagenum) {
                if (prev > 0) {
                    prevcontainer = $("<li class=\"prev pageNum\" data-page=\"" + prev + "\"><a><</a></li>");
                }
                if (next <= pages) {
                    nextcontainer = $("<li class=\"next pageNum\" data-page=\"" + next + "\"><a>></a></li>");
                }
                if (options.container.lastpage.enable && page < pages) {
                    //最后一页
                    lastpagecontainer = $("<li  class=\"last pageNum\" data-page=\"" + pages + "\"><a>" + options.container.lastpage.text + "</a></li>");
                }
            }

            if (options.container.lastpagenum && pages>1) {
                lastpagenumcontainer = $("<li class=\"pageNum\" data-page=\"" + pages + "\"><a>" + pages + "</a></li>");
                if (pages == page) {
                    lastpagenumcontainer.addClass("active");
                }
            }

            //循环页码
            if ((page + showpagenum) > pages) {
                //当前页后面的页码数量不足
                var endPage = pages - (options.container.lastpagenum ? 1 : 0);
                while (showpagenum > 0) {
                    if (endPage <= 1) {
                        break;
                    }
                    var tmp1 = $("<li  class=\"pageNum\" data-page=\"" + endPage + "\"><a>" + endPage + "</a></li>");
                    if (page == endPage) {
                        break;
                    }
                    pagecontainer.unshift(tmp1);
                    endPage--;
                    showpagenum--;
                }
                endPage = page;
                while (showpagenum > 0) {
                    if (endPage <= 1) {
                        break;
                    }
                    var tmp2 = $("<li  class=\"pageNum\" data-page=\"" + endPage + "\"><a>" + endPage + "</a></li>");
                    if (page == endPage) {
                        tmp2.addClass("active");
                    }
                    pagecontainer.unshift(tmp2);
                    endPage--;
                    showpagenum--;
                }

            }
            else {
                //当前页后面的页码数量充足
                var tmpPage = ((page == 1) ? (page + 1) : page);
                while (showpagenum > 0) {
                    var tmp3 = $("<li  class=\"pageNum\" data-page=\"" + tmpPage + "\"><a>" + tmpPage + "</a></li>");
                    if (page == tmpPage) {
                        tmp3.addClass("active");
                    }
                    pagecontainer.push(tmp3);
                    tmpPage++;
                    showpagenum--;
                }
            }
            //分隔符
            if (pagecontainer.length > 0) {
                //前面分隔符
                var startbutoneindex = pagecontainer[0].data("page");
                if (startbutoneindex>2) {
                    startspacescontainer = $("<li class=\"spaces\"><a>...</a></li>");
                }

                //后面分隔符
                var lastbutoneindex = pagecontainer[(pagecontainer.length - 1)].data("page");
                if (lastpagenumcontainer) {
                    if ((lastbutoneindex + 1) != pages) {
                        endspacescontainer = $("<li class=\"spaces\"><a>...</a></li>");
                    }
                }
                else {
                    if (lastbutoneindex < pages) {
                        endspacescontainer = $("<li class=\"spaces\"><a>...</a></li>");
                    }
                }


            }



            this._insert(container, prevcontainer);
            this._insert(container, firstpagecontainer);
            this._insert(container, startspacescontainer);
            for (var k = 0; k < pagecontainer.length; k++) {
                this._insert(container, pagecontainer[k]);
            }
            this._insert(container, endspacescontainer);
            this._insert(container, lastpagenumcontainer);
            this._insert(container, nextcontainer);
            this._insert(container, lastpagecontainer);
            

            if (options.container.jump && pages > options.showpagenum) {
                
                jumpcontainer.append(jumptext);
                jumpcontainer.append(jumpbutton);

                this._insert(container, jumpcontainer);
            }

            options.onChange(page);
        },

        _insert: function (container, subcontainer) {
            if (subcontainer) {
                container.append(subcontainer);
            }
        }
    };


    $.fn.pagenav = function (options) {
        this.each(function () {

            var instance = $.data(this, 'tabs');
            if (!instance) {
                $.data(this, 'tabs', new $.PageNavObject(options, this));
            }
        });
        return this;
    };

})(jQuery);