function Spin({
	root,
	buttonSpin,
	slices,
	output,
	loops = NaN,
	duration = 1000,
}) {
	// const SLICES_CLASS = '.slices';
	// const SLICE_CLASS = '.slice';

  const _EVENT_SPIN_START = 'spinstart';
  const _EVENT_SPIN_COMPLETE = 'spincomplete';
	const _EVENT_SPIN_CLICK = 'spinclick';

	const _COMMAND_SPIN = 'spin';
  const _COMMAND_GOTO = 'goto';

	let result = output;
	let slots = [];
	let isVertical = false;
	let sliceSize = 0;
	let usePx = false;
	let unit = '%';
	let spinsCompleted = 0;
	let transitionSpeedModifier = 0.8;

  let callbackStart;
  let callbackComplete;
  let callbackSpinClick;

	NodeList.prototype.toArray = function () {
		const array = new Array();
		
		for (let i = 0; i < this.length; i++) {
			this[i].index = i;

			array.push(this[i]);
		}

		return array;
	};

	HTMLCollection.prototype.toArray = function () {
		const array = new Array();
		
		for (let i = 0; i < this.length; i++) {
			this[i].index = i;

			array.push(this[i]);
		}

		return array;
	};

	// Setup the animation loop.
	function animate(time) {
		requestAnimationFrame(animate);
		TWEEN.update(time);
	}
	requestAnimationFrame(animate);

	// window.requestAnimationFrame = (function() {
	// 	return window.requestAnimationFrame ||
	// 		window.webkitRequestAnimationFrame ||
	// 		window.mozRequestAnimationFrame ||
	// 		window.oRequestAnimationFrame ||
	// 		window.msRequestAnimationFrame ||
	// 		function(callback) {
	// 			window.setTimeout(callback, 1000 / 60);
	// 		};
	// })();

	if (!(root instanceof HTMLElement)) {
		console.warn('Element root tidak dapat di devinisikan.');
		return;
	}

	// Button untuk eksekusi spin
	// Contoh: [document.querySelector('#el'), '.class', document.querySelectorAll('spin')]
	const triggers = [];

	if (Array.isArray(buttonSpin)) {
		for (let i = 0; i < buttonSpin.length; i++) {
			if (buttonSpin[i] instanceof HTMLElement) {
				triggers.push(buttonSpin[i]);
			} else if (typeof buttonSpin[i] === 'string') {
				const buttonSpinEls = document.querySelectorAll(buttonSpin[i]);

				for (let x = 0; x < buttonSpinEls.length; x++) {
					const buttonSpinEl = buttonSpinEls[x];

					if (buttonSpinEl instanceof HTMLElement) {
						triggers.push(buttonSpinEl);
					}
				}
			} else if (buttonSpin[i] instanceof NodeList) {
				for (let e = 0; e < buttonSpin[i].length; e++) {
					if (buttonSpin[i][e] instanceof HTMLElement) {
						triggers.push(buttonSpin[i][e]);
					}
				}
			}
		}
	} else if (typeof buttonSpin === 'object') {
		const buttonSpinKeys = Object.keys(buttonSpin);

		for (let i = 0; i < buttonSpinKeys.length; i++) { 
			const buttonSpinKey = buttonSpinKeys[i];

			if (buttonSpin[buttonSpinKey] instanceof HTMLElement) {
				triggers.push(buttonSpin[buttonSpinKey]);
			} else if (typeof buttonSpin[buttonSpinKey] === 'string') {
				const buttonSpinEls = document.querySelectorAll(buttonSpin[buttonSpinKey]);

				for (let x = 0; x < buttonSpinEls.length; x++) {
					const buttonSpinEl = buttonSpinEls[x];

					if (buttonSpinEl instanceof HTMLElement) {
						triggers.push(buttonSpinEl);
					}
				}
			} else if (buttonSpin[buttonSpinKey] instanceof NodeList) {
				for (let e = 0; e < buttonSpin[buttonSpinKey].length; e++) {
					if (buttonSpin[buttonSpinKey] instanceof HTMLElement) {
						triggers.push(buttonSpinEl[buttonSpinKey]);
					}
				}
			}
		}
	} else if (buttonSpin instanceof HTMLElement) {
		triggers.push(buttonSpin);
	} else if (buttonSpin instanceof NodeList) {
		for (let e = 0; e < buttonSpin.length; e++) {
			if (buttonSpin[e] instanceof HTMLElement) {
				triggers.push(buttonSpin[e]);
			}
		}
	} else if (typeof buttonSpin === 'string') {
		const buttonSpinEls = document.querySelectorAll(buttonSpin);

		for (let e = 0; e < buttonSpinEls.length; e++) {
			if (buttonSpinEls[e] instanceof HTMLElement) {
				triggers.push(buttonSpinEls[e]);
			}
		}
	}

	if (triggers.length === 0) {
		console.warn('Element buttonSpin tidak dapat di devinisikan.');
		return;
	}

	for (let i = 0; i < triggers.length; i++) {
		_addEventListener('click', triggers[i], onSpinClick, false);
	}

	(function _initialize() {
		if (Array.isArray(slices)) {
			
		} else if (slices instanceof HTMLElement) {

		} else if (slices instanceof NodeList) {
			for (let i = 0; i < slices.length; i++) {
				slots.push(new Slot(slices[i], i, i * loops));
			}
		} else if (typeof slices === 'object') {

		} else if (typeof slices === 'string') {

		}

		spinsCompleted = slots.length;

		if (slots.length > 0) {
			getSliceSize();
		}

		// const wheels = root.querySelectorAll(SLICES_CLASS);

		// for (let e = 0; e < wheels.length; e++) {
		// 	slots.push(new Slot(wheels[e], i, i * slotsDelay));
		// }
	})();

	function getSliceSize() {
		if (isVertical) {
			sliceSize = usePx === false ? 100 : parseInt(window.getComputedStyle(slots[0].getItem(0)).width);
		} else {
			sliceSize = usePx === false ? 100 : parseInt(window.getComputedStyle(slots[0].getItem(0)).height);
		}
	} 

	function getLimit(el) {
		if (el instanceof HTMLElement) {
			if (isVertical) {
				return isNaN(parseInt(el.style.left)) ? 0 : parseInt(el.style.left);
			}

			return isNaN(parseInt(el.style.top)) ? 0 : parseInt(el.style.top);
		}

		return 0;
	}

	function parseSlices(decrement) {
    if (decrement === true) {
      spinsCompleted = Math.max(0, spinsCompleted -= 1);
    } else {
      spinsCompleted += 1;
      if (spinsCompleted === slots.length) {
        const _slots = [];
        for (let i = 0; i < slots.length; i++) {
          _slots.push(slots[i]);
        }
				
        // dispatchEvent(EVENT_SPIN_COMPLETE, {
        //   slots: _slots
        // });
      }
    }
  }

	function onSpinClick(e) {
		const target = e.currentTarget || e.srcElement || e.target;

		_spin();

		dispatchEvent(_EVENT_SPIN_CLICK);
	}

	/**
	 * EVENT
	 */
	 function dispatchEvent(t, ps) {
    // events
    let obj = {};
    if (document.createEvent) {
      obj = document.createEvent('HTMLEvents');
      obj.initEvent(t, true, true);
      for (const p in ps) {
        obj[p] = ps[p];
      }
      root.dispatchEvent(obj);
    } else if (window.Event) {
			obj = new Event('')
		}

    // callbacks
    // obj = {};
    // for (var p in ps) {
    //   obj[p] = ps[p];
    // }
    // var cb = undefined;
    // switch (t) {
    //   case _EVENT_SPIN_START:
    //     obj.type = _EVENT_SPIN_START;
    //     cb = callbackStart;
    //     break;
    //   case _EVENT_SPIN_COMPLETE:
    //     obj.type = _EVENT_SPIN_COMPLETE;
    //     cb = callbackComplete;
    //     break;
		// 	case _EVENT_SPIN_CLICK:
		// 		obj.type = _EVENT_SPIN_CLICK;
		// 		cb = callbackSpinClick;
    // }
    // if (cb) {
    //   cb(obj);
    // }
  }

	function _addEventListener(event, el, handler, options) {
		if (typeof el.addEventListener === 'function') {
			el.addEventListener(event, handler, options);
		} else if (typeof el.attachEvent === 'function') {
			el.attachEvent('on'+event, handler, options);
		}
	}

	function removeEventHandler(event, el, handler, options) {
		if (typeof el.addEventListener === 'function') {
			el.removeEventListener(event, handler, options);
		} else if (typeof el.attachEvent === 'function') {
			el.detachEvent('on'+event, handler, options);
		}
	}

	/**
	 * SLOT
	 */
	function Slot(el, index, delay) {
		let data = [];
		let slices = el.children.toArray();
		let length = slices.length;
		let isSpinning = false;
		let isSlowing = false;
		let delayTimeout;
		let delta = 0;
		let animationStatus = -1;
    let speedIncrement = 0;
    let maxSpeed = 0;
		let decelerationSpeed = Math.asin(1);

		// const data = [];
		// for (let i = 0; i < result.length; i++) {
		// 	data.push(output[i]);
		// }

		function _spin() {
			if (isSpinning === false) {
				isSpinning = true;
				isSlowing = false;
				delta = 0;
				animationStatus = 0;
        speedIncrement = 0.8 + (Math.random() * 2);
        maxSpeed = (Math.random() * 20) + 20;
				
				clearTimeout(delayTimeout);
				delayTimeout = setTimeout(function () {
					isSlowing = true;
					clearTimeout(delayTimeout);
				}, duration + delay);

				_rollSlot.bind(this)();

				return true;
			}

			return false;
		}

		function _rollSlot() {
			if (delta !== 0) {
				if (isVertical) {
					el.style.left = (getLimit(el) - delta) + '%';
				} else {
					el.style.top = (getLimit(el) - delta) + '%';
				}
			}

			if (getLimit(el) < -sliceSize) {
				const limitDelta = Math.abs(getLimit(el)) % sliceSize;
        const n = Math.floor(Math.abs(getLimit(el)) / sliceSize);
        const toReorderArray = slices.splice(0, n);
        for (let i = 0; i < toReorderArray.length; i++) {
          const toReorder = toReorderArray[i];
          slices.push(toReorder);
          el.appendChild(toReorder);
        }
        if (isVertical) {
          el.style.left = -limitDelta + "%";
        } else {
          el.style.top = -limitDelta + "%";
        }
			}

			if (animationStatus !== -1 && isSpinning !== false) {
				requestAnimationFrame(_rollSlot.bind(this));
			} else {
				delta = 0;
				animationStatus = 0;
			}

			if (Math.abs(delta) >= Math.abs(maxSpeed)) {
				if (isSlowing) {
					animationStatus = 1;
				} else {
					animationStatus = 2;
				}
			}  else if (
				(Math.floor(delta) <= speedIncrement && animationStatus === 1) ||
				(Math.floor(delta) <= speedIncrement && animationStatus === 2)
			) {
				animationStatus = -1;
			}

			if (animationStatus === 0) {
        // is accelerating
        delta += (usePx === true ? speedIncrement : 0.5 * speedIncrement);
      } else if (animationStatus === 1) {
        // is decelerating
        delta -= (usePx === true ? decelerationSpeed : 0.1);
      } else if (animationStatus === 2) {
        // is at max speed
        delta = maxSpeed;
      } else if (animationStatus === -1) {
        // is stopped and going in place
        delta = 0;
        
				_gotoNearest.bind(this)();
      }
		}

		function _gotoNearest() {
      const reset = _reset.bind(this);

			if (isVertical) {
				const tween = new TWEEN.Tween({
					top: 0,
				});
				tween.to({ top: 0 }, 0.35);
				tween.easing(TWEEN.Easing.Cubic.InOut)
				tween.onUpdate(function(data) {
					el.style.top = data.top + unit;
				});
				tween.onComplete(reset);
				tween.start();
			} else {
				const tween = new TWEEN.Tween({
					top: 0,
				});
				tween.to({ top: 0 }, 0.35);
				tween.easing(TWEEN.Easing.Cubic.InOut)
				tween.onUpdate(function(data) {
					el.style.top = data.top + unit;
				});
				tween.onComplete(reset);
				tween.start();
			}
    }

		function _reset() {
      _stop.bind(this)();

			if (data !== undefined && Array.isArray(data)) {
				const n = slices.findIndex((e) => e.getAttribute('data-value') == data[index]);

				_goto(slices[n].index, true);
			} else {
				const n = Math.floor(Math.abs(getLimit(el)) / sliceSize);
				const toReorderArray = slices.splice(0, n);
				for (let i = 0; i < toReorderArray.length; i++) {
					const toReorder = toReorderArray[i];
					slices.push(toReorder);
					el.appendChild(toReorder);
				}
			}

			if (isVertical) {
				el.style.left = 0 + unit;
			} else {
				el.style.top = 0 + unit;
			}

      // dispatchEvent(EVENT_SPIN_COMPLETE_SINGLE, {
      //   el: this
      // });
      parseSlices();
    }

		function _goto(id, backspin) {
      if (isSpinning === false) {
        isSpinning = true;

        let count = 0;
        for (let i = 0; i < slices.length; i++) {
          const slice = slices[i];
          if (slice.index === id) {
            count = i;
            break;
          }
        }

        const t = (((Math.random() * 750) + 1250) / 1000) * transitionSpeedModifier;

        // var cb = _reset.bind(this);
        let l;
        if (backspin === true) {
          var toReorderArray = slices.splice(0, count);
          for (var i = 0; i < toReorderArray.length; i++) {
            var toReorder = toReorderArray[i];
            slices.push(toReorder);
            el.appendChild(toReorder);
          }
          l = "0" + unit;
          if (isVertical) {
            el.style.left = -sliceSize * (length - count) + unit;
          } else {
            el.style.top = -sliceSize * (length - count) + unit;
          }
        } else {
          l = "" + (-sliceSize * count) + unit;
        }

        if (isVertical) {
					const tween = new TWEEN.Tween({
						left: t,
					});
					tween.to({ left: l });
					tween.easing(TWEEN.Easing.Cubic.InOut)
					tween.onUpdate(function(data) {
						el.style.top = data.top + unit;
					});
					tween.onComplete(_resetStyle);
					tween.start();
				} else {
					const tween = new TWEEN.Tween({
						top: t,
					});
					tween.to({ top: l });
					tween.easing(TWEEN.Easing.Cubic.InOut)
					tween.onUpdate(function(data) {
						el.style.top = data.top + unit;
					});
					tween.onComplete(_resetStyle);
					tween.start();
				}

				function _resetStyle() {
					if (isVertical) {
						el.style.left = 0 + unit;
					} else {
						el.style.top = 0 + unit;
					}
				}

        // dispatchEvent(EVENT_SPIN_START_SINGLE, {
        //   slot: this,
        //   command: _COMMAND_GOTO,
        //   index: id,
        //   backspin: backspin
        // });
      }
    }

		function _stop() {
      isSpinning = false;
    }

		function _data(value) {
			if (value && Array.isArray(value)) {
				data = value;
			}
		}

		function _getSlice(id) {
      if (id === undefined) {
        return slices[0];
      }

      return slices[id];
    }

    function _getSlices() {
      return slices;
    }

    function _getIndex() {
      return index;
    }

		function _getSpinningStatus() {
      return isSpinning;
    }

		return {
			spin: _spin,
			data: _data,
			isSpinning: _getSpinningStatus,
			getItem: _getSlice,
			getItems: _getSlices,
		};
	}

	/**
	 * API
	 */
	function _spin(index) {
		let spinStarted = false;

		if (index !== undefined && index < slots.length) {

		} else {
			for (let i = 0; i < slots.length; i++) {
				const slot = slots[i];

				if (slot.isSpinning() === false) {
					slot.data(result);

					slot.spin();
				}

				spinStarted = spinStarted === false
					? slot.isSpinning() === true
					: true;
			}
		}

		if (spinStarted) {
      dispatchEvent(_EVENT_SPIN_START, {
        command: _COMMAND_SPIN
      });
    }
	}

	function _setOutput(output) {
		if (output && Array.isArray(output)) {
			result = output;
		}
	}

	return {
		output: _setOutput,
	}
}