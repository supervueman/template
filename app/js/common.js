//Mobile menu
var mob_menu = new mmenu({
  menu: '.mob-mnu',
  blocker: '.blocker',
  hamburger: '.hamburger',
  page: '.page'
});
mob_menu.init();
//Fullpage
var space_page = new spage({
  screen_scroll: '.screen-scroll',
  sect: '.sect',
  link: '.screen-link',
  interval: 1300,
  oversize: false,
  afterChange: function(){},
  beforeChange: function(){
  	mob_menu.close();
  }
});
space_page.init();

var hidden_input = $('.hidden-input');
var text;
function inputVal(pop){
  if($(pop.ths_button[0]).data('order') != '' && $(pop.ths_button[0]).data('order') != undefined){
    text = $(pop.ths_button[0]).data('order');
    // console.log($(pop.ths_button[0]).data('order'))
  }
  if($(pop.opened[0]).find('.h3').length !== 0){
    text = $(pop.opened[0]).find('.h3').text();
    //console.log(text)
  }
  if($(pop.opened[0]).find('.hidden-input').val() != undefined){
    $(pop.opened[0]).find('.hidden-input').val(text);
    console.log($(pop.opened[0]).find('.hidden-input').val())
  }
}
function clearInputVal(pop){
  text = '';
  if($(pop.opened[0]).find('.hidden-input').val() != undefined){
    $(pop.opened[0]).find('.hidden-input').val(text);
  }
}

//Popup
var popup = new spop({
	popup: '.open-popup',
  close_btn: '.close-popup, .blocker',
  from: '.hidden',
  to: 'body',
  wrap: 'html',
  when_open: function(){},
  when_close: function(){}
});
popup.init();

//Slider
var space_slide = new sslider({
    slider: '.slider',
    row: 1,
    items: 1,
    items_slide: 1,
    res_w: true,
    res_h: true,
    arrow: '.control',
    responsive: {
      width:{
        '300':{
          loop: true,
          row: 1,
          items: 1,
          items_slide: 1
        },
        '768':{
          loop: true,
          row: 1,
          items: 2,
          items_slide: 1
        },
        '1200':{
          loop: true,
          row: 1,
          items: 3,
          items_slide: 1
        }
      }
    },
    filter: true,
    filter_wrap: '.filter',
    chosen: '.filter-link',
    viewport: '.viewport',
    slide_line: '.slide-line',
    item: '.item',
    automove: false,
    interval: 5000,
    loop: false
  });
space_slide.init();

var successMsg = $('.message-success'),
    errorMsg = $('.message-error');
$('form').submit(function() {
  var th = $(this);
  $.ajax({
    url: 'mail',
    type: 'GET',
    data: th.serialize(),
  })
  .done(function(data) {
    setTimeout(function() {
      successMsg.addClass('notification-visible');
      th.trigger('reset');
    }, 1000);
    setTimeout(function() {
      successMsg.removeClass('notification-visible');
    }, 5000);
  })
  .fail(function() {
    setTimeout(function() {
      errorMsg.addClass('notification-visible');
      th.trigger('reset');
    }, 1000);
    setTimeout(function() {
      errorMsg.removeClass('notification-visible');
    }, 5000);
  });
  return false;
});

var offline = $('.offline'),
    online = $('.online'),
    notification = $('.notification');
window.addEventListener('online', function(e) {
  $('.notification').removeClass('notification-visible');
  online.addClass('notification-visible');
  setTimeout(function(){
    online.removeClass('notification-visible');
  }, 5000);
}, false);
window.addEventListener('offline', function(e) {
  $('.notification').removeClass('notification-visible');
  offline.addClass('notification-visible');
  setTimeout(function(){
    offline.removeClass('notification-visible');
  }, 5000);
}, false);

$(".call-phone").mask("+7 (999) 999-99-99");

$('.sect').mousemove(function(e) {
	var x = e.screenX / 40 + 50 + '%';
	var y = e.screenY / 40 + '%';
  $('.bg-overlay-d').css('background-position', x + ' ' + y);
});

$(window).on("load", function(){
  var preloader = $('.preloader'),
	    body = $('body');
	preloader.fadeOut();
	body.addClass('ready');
});
