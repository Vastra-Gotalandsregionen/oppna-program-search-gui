$(document).ready(function() {

	// Todo: Fix better solution. We should only hide it when no selection has been made.
	$('.filter select').on('change', function() {
		$('.reset').show();
	});

	$('.reset').click(function(){
		$(this).hide();
	});

	if( $('#filter').length ) {

		var filter = document.getElementById('filter');
		var filterClosed = filter.getAttribute('data-translation-filter-closed');
		var filterOpen = filter.getAttribute('data-translation-filter-open');
		var filterGroup = $(".filter-group fieldset");

		// Filter Button
		var filterButton =
		$('<button>', {
			html: $('<span>', {
				text: filterClosed
			}),
			class: 'filter-button'
		});

		filterButton.attr('aria-expanded', 'false');

	}

	// Enquire JS
	enquire.register("screen and (max-width:600px)", {

		match : function() {

			if( $('#filter').length ) {
				$("#filter").prepend(filterButton);
				filterButton.on("click", function(){

					// Hide
					if($(this).hasClass('active')){
						$(this).removeClass('active');
						$(this).attr('aria-expanded', 'false');
						filterGroup.slideUp();
						$(this).text(filterClosed);
					}

					// Show
					else {
						$(this).addClass('active');
						$(this).attr('aria-expanded', 'true');
						filterGroup.slideDown();
						$(this).text(filterOpen);
					}

					// Add Active Class
					filterGroup.toggleClass('active');

					return false;

				});
			}

		},
		unmatch : function() {

			if( $('#filter').length ) {
				$(".filter-group fieldset").show();
				filterButton.remove();

				// Remove Aria Roles
				filterGroup.removeAttr('aria-expanded');

				// Remove Active States
				filterGroup.removeClass('active');
			}
		}
	});

		var vgrSearch = new Bloodhound({
		datumTokenizer: function (datum) {
			return Bloodhound.tokenizers.whitespace(datum.value);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: 'http://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=470fd2ec8853e25d2f8d86f685d2270e',
			filter: function (vgrSearch) {
				// Map the remote source JSON array to a JavaScript array
				return $.map(vgrSearch.results, function (movie) {
					return {
						value: movie.original_title
					};
				});
			}
		},
		limit: 8
	});
	vgrSearch.initialize();

	$('#search').typeahead({
		hint: true,
		highlight: true,
		minLength: 2
	},
	{
		displayKey: 'value',
		source: vgrSearch.ttAdapter()
	});


});
