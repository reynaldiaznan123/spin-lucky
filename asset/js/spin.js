function Spin({
	root,
	buttonSpin,
	slices,
	options,
}) {
	// const SLICES_CLASS = '.slices';
	// const SLICE_CLASS = '.slice';
	const SLOT_DELAY = 10;

	let slots = [];
	let isVertical = false;
	let sliceSize = 0;
	let usePx = false;
	let unit = '%';

	NodeList.prototype.toArray = function () {
		const array = new Array();
		
		for (let i = 0; i < this.length; i++) {
			array.push(this[i]);
		}

		return array;
	};

	HTMLCollection.prototype.toArray = function () {
		const array = new Array();
		
		for (let i = 0; i < this.length; i++) {
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
				slots.push(new Slot(slices[i], i, i * SLOT_DELAY));
			}
		} else if (typeof slices === 'object') {

		} else if (typeof slices === 'string') {

		}

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

	function onSpinClick(e) {
		const target = e.currentTarget || e.srcElement || e.target;

		_spin();
	}

	/**
	 * EVENT
	 */
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
		let slices = el.children.toArray();
		let isSpinning = false;
		let isSlowing = false;
		let delayTimeout;
		let delta = 0;
		let animationStatus = -1;
    let speedIncrement = 0;
    let maxSpeed = 0;
		let decelerationSpeed = Math.asin(1);

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
				}, 1000 + delay);

				_rollSlot.bind(this)();

				return false;
			}

			return true;
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
				let limitDelta = Math.abs(getLimit(el)) % sliceSize;
        let n = Math.floor(Math.abs(getLimit(el)) / sliceSize);
        let toReorderArray = slices.splice(0, n);
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

      const n = Math.floor(Math.abs(getLimit(el)) / sliceSize);
      const toReorderArray = slices.splice(0, n);
      for (let i = 0; i < toReorderArray.length; i++) {
        const toReorder = toReorderArray[i];
        slices.push(toReorder);
        el.appendChild(toReorder);
      }
      if (isVertical) {
        el.style.left = 0 + unit;
      } else {
        el.style.top = 0 + unit;
      }

      // dispatchEvent(EVENT_SPIN_COMPLETE_SINGLE, {
      //   el: this
      // });
      // parseSlices();
    }

		function _stop() {
      isSpinning = false;
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
					slot.spin();
				}
			}
		}
	}
}