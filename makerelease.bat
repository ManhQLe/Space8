@echo off

@SET COMPILE="C:\Users\Manh Le\Desktop\Mini JavaScript\compiler.jar"
@SET JAVA="C:\Program Files (x86)\Java\jre1.8.0_65\bin\java.exe"

@SET DEST=release
@SET DSTBROWSERPATH=%DEST%
@SET SRCBROWSERPATH=src

@echo ------Releasing Browser Scripts------

@%JAVA% -jar %COMPILE% --compilation_level SIMPLE_OPTIMIZATIONS --js %SRCBROWSERPATH%\Space8.js --js_output_file %DSTBROWSERPATH%\Space8.min.js
@xcopy %SRCBROWSERPATH%\Space8.js %DSTBROWSERPATH% /y
@xcopy ..\Ctrl8\release\*.js %DSTBROWSERPATH% /y

@echo ------Completed------