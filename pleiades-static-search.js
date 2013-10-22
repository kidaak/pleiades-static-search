// Generated by CoffeeScript 1.3.3
(function() {
  var begins_with, geojson_embed, pleiades_link, populate_results, search_for;

  begins_with = function(input_string, comparison_string) {
    return input_string.toUpperCase().indexOf(comparison_string.toUpperCase()) === 0;
  };

  geojson_embed = function(pleiades_id) {
    var iframe;
    iframe = $('<iframe>');
    iframe.attr('height', 210);
    iframe.attr('width', '100%');
    iframe.attr('frameborder', 0);
    iframe.attr('src', "https://render.github.com/view/geojson?url=https://raw.github.com/ryanfb/pleiades-geojson/master/geojson/" + pleiades_id + ".geojson");
    return iframe;
  };

  pleiades_link = function(pleiades_id) {
    var link;
    link = $('<a>').attr('href', "http://pleiades.stoa.org/places/" + pleiades_id);
    link.attr('target', '_blank');
    link.text(pleiades_id);
    return link;
  };

  populate_results = function(results) {
    var col, i, result, row, _i, _j, _len, _ref, _ref1, _results;
    $('#results').empty();
    _results = [];
    for (i = _i = 0, _ref = results.length; _i <= _ref; i = _i += 3) {
      row = $('<div>').attr('class', 'row');
      _ref1 = results.slice(i, i + 3);
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        result = _ref1[_j];
        col = $('<div>').attr('class', 'col-md-4');
        col.append($('<p>').text("" + result[0] + " - ").append(pleiades_link(result[1])));
        col.append(geojson_embed(result[1]));
        $.ajax("http://ryanfb.github.io/pleiades-geojson/geojson/" + result[1] + ".geojson", {
          type: 'GET',
          dataType: 'json',
          crossDomain: true,
          error: function(jqXHR, textStatus, errorThrown) {
            return console.log("AJAX Error: " + textStatus);
          },
          success: function(data) {
            return col.append($('<em>').text(data.description));
          }
        });
        row.append(col);
      }
      $('#results').append(row);
      _results.push($('#results').append($('<br>')));
    }
    return _results;
  };

  search_for = function(value, index) {
    var matches;
    console.log("Searching for " + value);
    matches = index.filter(function(entry) {
      return begins_with(entry[0], value);
    });
    return populate_results(matches.reverse());
  };

  $(document).ready(function() {
    return $.ajax("http://ryanfb.github.io/pleiades-geojson/name_index.json", {
      type: 'GET',
      dataType: 'json',
      crossDomain: true,
      error: function(jqXHR, textStatus, errorThrown) {
        return console.log("AJAX Error: " + textStatus);
      },
      success: function(data) {
        var name, names;
        names = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            name = data[_i];
            _results.push(name[0]);
          }
          return _results;
        })();
        return $('#search').autocomplete({
          delay: 600,
          minLength: 3,
          source: function(request, response) {
            var matches;
            matches = names.filter(function(name) {
              return begins_with(name, request.term);
            });
            return response(matches.reverse());
          },
          search: function(event, ui) {
            return search_for($('#search').val(), data);
          },
          select: function(event, ui) {
            return search_for(ui.item.value, data);
          }
        });
      }
    });
  });

}).call(this);
