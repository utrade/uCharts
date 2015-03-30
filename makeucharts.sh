java -jar ./compiler.jar \
     --js ./include/raphael.js \
     --js ./include/g.raphael_custom.js \
     --js ./include/g.line_custom.js \
     --js ./include/date.format.js \
     --js ./chart.js \
     --js ./trading.js \
     --js ./ucharttechnical.js \
     --js_output_file ${1-ucharts.min.js }

