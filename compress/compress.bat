:: JS 檔案合併壓縮
:: @param 1 要合併的檔案清單
:: @param 2 檔案類型
:: @param 3 輸出名稱
::
:: 2015-1-20 / Shisha

@ECHO OFF

:: check
IF ("%1" == "") (
	PAUSE
	EXIT
)

:: yuicompressor
SET COMPRESSOR=%~p0
SET COMPRESSOR=%COMPRESSOR%yuicompressor-2.4.8.jar
:: temp name
SET TEMP_FILE_NAME=merged.tmp

ECHO.

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
ECHO Output File: %OUTPUT_NAME%

:: ================================================================

ECHO Starting Merge Files...
FOR /f %%i in (%1) DO (
	ECHO Merge: %%i
	type %%i >>%TEMP_FILE_NAME%
)
ECHO Files Merged.

ECHO.
ECHO Compress File...

java -jar %COMPRESSOR% --type %FILE_TYPE% --charset utf-8 %TEMP_FILE_NAME% -o %OUTPUT_NAME%
ECHO End.

ECHO.
ECHO Remove Temp File: %TEMP_FILE_NAME%

DEL %TEMP_FILE_NAME%
ECHO Finished.

PAUSE