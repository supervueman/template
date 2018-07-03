(function(){
  function Animator (options) {
    var _ = this;
        _.elems = $(options.elems);
        _.elem;
        _.scrollContainer = $(options.scrollContainer);
        _.animator = options.animator;
        _.offset = options.offsetPercent;
    _.elemAnimator = function () {
      $(_.scrollContainer).scroll(function () {
        $.each(_.elems, function(i){
          _.elem = $(_.elems[i]);
          if (100 * _.elem.offset().top / $(window).height() <= _.offset) {
            _.elem.addClass(_.animator);
          }
        });
      });
    }
    _.init = function () {
      _.elemAnimator();
    }
  }
  window.Animator = Animator;
})();
