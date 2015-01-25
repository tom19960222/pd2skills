:: Merge Files
:: 2015-1-20 / Shisha

@ECHO OFF
SET OUTPUTNAME=merged.txt

FOR %%a IN (%*) DO (
	TYPE %%a >>%OUTPUTNAME%
)