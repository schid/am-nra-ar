REM Following line in original script incorrectly sets all child folder permissions
REM icacls . /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls app_code /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)RX
icacls app_browsers /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)RX
icacls app_data /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls bin /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)R
icacls config /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls css /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls data /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls masterpages /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls media /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls python /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls scripts /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls umbraco /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)R
icacls usercontrols /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)R
icacls xslt /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls web.config /grant "IIS APPPOOL\DefaultAppPool":(OI)(CI)M
icacls web.config /grant "IIS APPPOOL\DefaultAppPool":M
REM If you have installed the Robots.txt editor package you need the following line too
icacls robots.txt /grant "IIS APPPOOL\DefaultAppPool":M