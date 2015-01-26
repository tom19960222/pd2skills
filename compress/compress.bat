:: JS 檔案合併壓縮
:: @param 1 要合併的檔案清單
:: @param 2 檔案類型
:: @param 3 輸出名稱
::
:: 2015-1-20 / Shisha

@ECHO OFF

:: yuicompressor
SET COMPRESSOR=%~p0
SET COMPRESSOR=%COMPRESSOR%yuicompressor-2.4.8.jar
:: temp name
SET TEMP_FILE_NAME=merged.tmp

:: set file type
IF NOT ("%2" == "") (
	SET FILE_TYPE=%2
) ELSE (
	SET FILE_TYPE=js
)

:: set output name
IF NOT ("%3" == "") (
	SET OUTPUT_NAME=%3
) ELSE (
	SET OUTPUT_NAME=%~n1
	SET OUTPUT_NAME=%OUTPUT_NAME%.min.%FILE_TYPE%
)


:: ================================================================

:: 合併檔案
FOR /f %%i in (%1) DO (
	type %%i >>%TEMP_FILE_NAME%
)

:: 壓縮
java -jar %COMPRESSOR% --type %FILE_TYPE% --charset utf-8 %TEMP_FILE_NAME% -o %OUTPUT_NAME%
:: 刪除暫存檔
DEL %TEMP_FILE_NAME%