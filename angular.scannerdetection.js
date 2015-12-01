/*
 * Angular Scanner Detection
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 * https://github.com/DazeySolutions/angular-scanner-detection
 *
 * Version: 0.0.1
 *
 */
'use strict';
/* global angular */
(function () {
    var module;
    module = angular.module("scanner.detection", []);

    module.controller('ngScannerDetectController', ['$scope',
        function ($scope) {
            var firstCharTime = 0,
                lastCharTime = 0,
                callIsScanner = false,
                testTimer = false,
                scanButtonCounter = 0;

            $scope.onKeyDown = function (e) {
                // If it's just the button of the scanner, ignore it and wait for the real input
                if ($scope.options.scanButtonKeyCode !== false && e.which == $scope.options.scanButtonKeyCode) {
                    scanButtonCounter++;
                    // Cancel default
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                // Add event on keydown because keypress is not triggered for non character keys (tab, up, down...)
                // So need that to check endChar and startChar (that is often tab or enter) and call keypress if necessary
                else if ((firstCharTime && $scope.options.endChar.indexOf(e.which) !== -1) || (!firstCharTime && $scope.options.startChar.indexOf(e.which) !== -1)) {
                    $scope.onKeyPress(e);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            };

            $scope.onKeyPress = function (e) {

                if ($scope.options.stopPropagation) e.stopImmediatePropagation();
                if ($scope.options.preventDefault) e.preventDefault();

                if (firstCharTime && $scope.options.endChar.indexOf(e.which) !== -1) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    callIsScanner = true;
                } else if (!firstCharTime && $scope.options.startChar.indexOf(e.which) !== -1) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    callIsScanner = false;
                } else {
                    if (typeof (e.which) != 'undefined') {
                        $scope.options.model += String.fromCharCode(e.which);
                    }
                    callIsScanner = false;
                }

                if (!firstCharTime) {
                    firstCharTime = Date.now();
                }
                lastCharTime = Date.now();

                if (testTimer) clearTimeout(testTimer);
                if (callIsScanner) {
                    scannerDetectionTest();
                    testTimer = false;
                }

                if ($scope.options.onReceive) $scope.options.onReceive(e);
            };

            var scannerDetection = function (options) {
                var defaults = {
                    onComplete: false, // Callback after detection of a successfull scanning (scanned string in parameter)
                    onError: false, // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
                    onReceive: false, // Callback after receiving and processing a char (scanned char in parameter)
                    onKeyDetect: false, // Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
                    timeBeforeScanTest: 100, // Wait duration (ms) after keypress event to check if scanning is finished
                    avgTimeByChar: 30, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
                    minLength: 6, // Minimum length for a scanning
                    endChar: [9, 13], // Chars to remove and means end of scanning
                    startChar: [], // Chars to remove and means start of scanning
                    ignoreIfFocusOn: false, // do not handle scans if the currently focused element matches this selector
                    scanButtonKeyCode: false, // Key code of the scanner hardware button (if the scanner button a acts as a key itself) 
                    scanButtonLongPressThreshold: 3, // How many times the hardware button should issue a pressed event before a barcode is read to detect a longpress
                    onScanButtonLongPressed: false, // Callback after detection of a successfull scan while the scan button was pressed and held down
                    stopPropagation: false, // Stop immediate propagation on keypress event
                    preventDefault: false // Prevent default action on keypress event
                };
                if (typeof options === "function") {
                    options = {
                        onComplete: options
                    };
                }
                if (typeof options !== "object") {
                    options = $.extend({}, defaults);
                } else {
                    options = $.extend({}, defaults, options);
                }
                return options;
            };
            var scannerDetectionTest = function () {
                // If string is given, test it
                if (!scanButtonCounter) {
                    scanButtonCounter = 1;
                }

                // If all condition are good (length, time...), call the callback and re-initialize the plugin for next scanning
                // Else, just re-initialize
                if ($scope.options.model.length >= $scope.options.minLength && lastCharTime - firstCharTime < $scope.options.model.length * $scope.options.avgTimeByChar) {
                    if ($scope.options.onScanButtonLongPressed && scanButtonCounter > $scope.options.scanButtonLongPressThreshold) {
                        $scope.options.onScanButtonLongPressed();
                    } else if ($scope.options.onComplete) {
                        $scope.options.onComplete();
                    }

                    initScannerDetection();
                    return true;
                } else {
                    if ($scope.options.onError) $scope.options.onError();
                    initScannerDetection();
                    return false;
                }
            };
            var init = function () {
                $scope.options = scannerDetection($scope.ngScannerDetect);
                initScannerDetection();
            };

            var initScannerDetection = function () {
                firstCharTime = 0;
                scanButtonCounter = 0;
            };

            init();
        }
    ]);

    module.directive('ngScannerDetect',
        function () {
            return {
                restrict: 'A',
                scope: {
                    ngScannerDetect: '='
                },
                controller: 'ngScannerDetectController',
                link: function (scope, elm, attrs) {
                    elm.bind('keypress', function (e) {
                        scope.onKeyPress(e);
                    });
                    elm.bind('keydown', function (e) {
                        scope.onKeyDown(e);
                    });
                }
            };
        }
    );

}).call(this);