:: JS 檔案合併壓縮
:: 需求: yuicompressor
:: 輸入: 要合併的JS清單檔案
:: 輸出: 清單檔案名稱.min.js
:: 2015-1-20 / Shisha

@ECHO OFF

SET COMPRESS=yuicompressor-2.4.8.jar
SET OUTPUT_NAME=%~n1%
SET TEMP_FILE_NAME=merged.tmp

FOR /f %%i in (%1) DO (
	type %%i >>%TEMP_FILE_NAME%
)

java -jar %COMPRESS% --type js --charset utf-8 %TEMP_FILE_NAME% -o %OUTPUT_NAME%.min.js
DEL %TEMP_FILE_NAME%