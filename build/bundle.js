
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* node_modules/sveltestrap/src/Col.svelte generated by Svelte v3.42.4 */
    const file$7 = "node_modules/sveltestrap/src/Col.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: div_class_value = /*colClasses*/ ctx[0].join(' ')
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$7, 60, 0, 1427);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				{ class: div_class_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","xs","sm","md","lg","xl","xxl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Col', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { xs = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	const colClasses = [];
    	const lookup = { xs, sm, md, lg, xl, xxl };

    	Object.keys(lookup).forEach(colWidth => {
    		const columnProp = lookup[colWidth];

    		if (!columnProp && columnProp !== '') {
    			return; //no value for this width
    		}

    		const isXs = colWidth === 'xs';

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			if (columnProp.size || columnProp.size === '') {
    				colClasses.push(colClass);
    			}

    			if (columnProp.push) {
    				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
    			}

    			if (columnProp.pull) {
    				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
    			}

    			if (columnProp.offset) {
    				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    			}
    		} else {
    			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    		}
    	});

    	if (!colClasses.length) {
    		colClasses.push('col');
    	}

    	if (className) {
    		colClasses.push(className);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('xs' in $$new_props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(7, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(8, xxl = $$new_props.xxl);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getColumnSizeClass,
    		isObject,
    		className,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		colClasses,
    		lookup
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('xs' in $$props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(7, xl = $$new_props.xl);
    		if ('xxl' in $$props) $$invalidate(8, xxl = $$new_props.xxl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colClasses, $$restProps, className, xs, sm, md, lg, xl, xxl, $$scope, slots];
    }

    class Col extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			class: 2,
    			xs: 3,
    			sm: 4,
    			md: 5,
    			lg: 6,
    			xl: 7,
    			xxl: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Col",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get class() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xxl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xxl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Row.svelte generated by Svelte v3.42.4 */
    const file$6 = "node_modules/sveltestrap/src/Row.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$6, 39, 0, 980);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === 'object') {
    		return ['xs', 'sm', 'md', 'lg', 'xl'].map(colWidth => {
    			const isXs = colWidth === 'xs';
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === 'number' && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('noGutters' in $$new_props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ('form' in $$new_props) $$invalidate(4, form = $$new_props.form);
    		if ('cols' in $$new_props) $$invalidate(5, cols = $$new_props.cols);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		noGutters,
    		form,
    		cols,
    		getCols,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('noGutters' in $$props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ('form' in $$props) $$invalidate(4, form = $$new_props.form);
    		if ('cols' in $$props) $$invalidate(5, cols = $$new_props.cols);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 60) {
    			$$invalidate(0, classes = classnames(className, noGutters ? 'gx-0' : null, form ? 'form-row' : 'row', ...getCols(cols)));
    		}
    	};

    	return [classes, $$restProps, className, noGutters, form, cols, $$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { class: 2, noGutters: 3, form: 4, cols: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutters() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutters(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Create a ripple action
     * @typedef {{ event?: string; transition?: number; zIndex?: string; rippleColor?: string; disabled?: boolean }} Options
     * @param {Element} node
     * @param {Options} [options={}]
     * @returns {{ destroy: () => void; update: (options?: Options) => void }}
     */
    function ripple(node, options = {}) {
      // Default values.
      const props = {
        event: options.event || 'click',
        transition: options.transition || 150,
        zIndex: options.zIndex || '100',
        bg: options.rippleColor || null,
        disabled: options.disabled || false,
      };

      const handler = event => rippler(event, node, props);

      if (!props.disabled) {
        node.addEventListener(props.event, handler);
      }

      function rippler(event, target, { bg, zIndex, transition }) {
        // Get border to avoid offsetting on ripple container position
        const targetBorder = parseInt(
          getComputedStyle(target).borderWidth.replace('px', '')
        );

        // Get necessary variables
        const rect = target.getBoundingClientRect(),
          left = rect.left,
          top = rect.top,
          width = target.offsetWidth,
          height = target.offsetHeight,
          dx = event.clientX - left,
          dy = event.clientY - top,
          maxX = Math.max(dx, width - dx),
          maxY = Math.max(dy, height - dy),
          style = window.getComputedStyle(target),
          radius = Math.sqrt(maxX * maxX + maxY * maxY),
          border = targetBorder > 0 ? targetBorder : 0;

        // Create the ripple and its container
        const ripple = document.createElement('div');
        const rippleContainer = document.createElement('div');
        rippleContainer.className = 'ripple-container';
        ripple.className = 'ripple';

        // Styles for the ripple
        ripple.style.marginTop = '0px';
        ripple.style.marginLeft = '0px';
        ripple.style.width = '1px';
        ripple.style.height = '1px';
        ripple.style.transition = `all ${transition}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.position = 'relative';
        ripple.style.zIndex = zIndex;
        if (bg !== null) {
          ripple.style.backgroundColor = bg;
        }

        // Styles for the rippleContainer
        rippleContainer.style.position = 'absolute';
        rippleContainer.style.left = 0 - border + 'px';
        rippleContainer.style.top = 0 - border + 'px';
        rippleContainer.style.height = '0';
        rippleContainer.style.width = '0';
        rippleContainer.style.pointerEvents = 'none';
        rippleContainer.style.overflow = 'hidden';

        // Store target position to change it after
        const storedTargetPosition =
          target.style.position.length > 0
            ? target.style.position
            : getComputedStyle(target).position;
        // Change target position to relative to guarantee ripples correct positioning
        if (
          storedTargetPosition !== 'relative' &&
          storedTargetPosition !== 'absolute'
        ) {
          target.style.position = 'relative';
        }

        rippleContainer.appendChild(ripple);
        target.appendChild(rippleContainer);

        ripple.style.marginLeft = dx + 'px';
        ripple.style.marginTop = dy + 'px';

        rippleContainer.style.width = width + 'px';
        rippleContainer.style.height = height + 'px';
        rippleContainer.style.borderTopLeftRadius = style.borderTopLeftRadius;
        rippleContainer.style.borderTopRightRadius = style.borderTopRightRadius;
        rippleContainer.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
        rippleContainer.style.borderBottomRightRadius =
          style.borderBottomRightRadius;
        rippleContainer.style.direction = 'ltr';

        setTimeout(() => {
          ripple.style.width = radius * 2 + 'px';
          ripple.style.height = radius * 2 + 'px';
          ripple.style.marginLeft = dx - radius + 'px';
          ripple.style.marginTop = dy - radius + 'px';
        }, 0);

        function clearRipple() {
          setTimeout(() => {
            ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)';
          }, 250);

          // Timeout set to get a smooth removal of the ripple
          setTimeout(() => {
            rippleContainer.parentNode.removeChild(rippleContainer);
          }, transition + 250);

          // After removing event set position to target to it's original one
          // Timeout it's needed to avoid jerky effect of ripple jumping out parent target
          setTimeout(() => {
            let clearPosition = true;
            for (let i = 0; i < target.childNodes.length; i++) {
              if (target.childNodes[i].className === 'ripple-container') {
                clearPosition = false;
              }
            }

            if (clearPosition) {
              if (storedTargetPosition !== 'static') {
                target.style.position = storedTargetPosition;
              } else {
                target.style.position = '';
              }
            }
          }, transition + 250);
        }

        clearRipple();
      }

      return {
        destroy() {
          node.removeEventListener(props.event, handler);
        },
        update(newProps = {}) {
          if (newProps.disabled) {
            node.removeEventListener(props.event, handler);
          } else {
            node.addEventListener(props.event, handler);
          }
        },
      };
    }

    /**
     * An action to set up arbitrary event listeners dynamically.
     * @param {Element} node
     * @param {Array<{ name: string; handler: EventListenerOrEventListenerObject }>} args The event listeners to be registered
     * @returns {{ destroy: () => void }}
     */
    function events(node, args) {
      if (args != null) {
        for (const event of args) {
          node.addEventListener(event.name, event.handler);
        }
      }

      return {
        destroy() {
          if (args != null) {
            for (const event of args) {
              node.removeEventListener(event.name, event.handler);
            }
          }
        },
      };
    }

    /**
     * Filters out falsy classes.
     * @param {...(string | false | null)} args The classes to be filtered
     * @return {string} The classes without the falsy values
     */
    function classes(...args) {
      return args.filter(cls => !!cls).join(' ');
    }

    /* node_modules/attractions/button/button.svelte generated by Svelte v3.42.4 */
    const file$5 = "node_modules/attractions/button/button.svelte";

    // (123:0) {:else}
    function create_else_block(ctx) {
    	let button;
    	let button_class_value;
    	let ripple_action;
    	let eventsAction_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	let button_levels = [
    		{ type: "button" },
    		{ disabled: /*disabled*/ ctx[10] },
    		{
    			class: button_class_value = classes('btn', /*_class*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[15]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			toggle_class(button, "filled", /*filled*/ ctx[1]);
    			toggle_class(button, "outline", /*outline*/ ctx[2]);
    			toggle_class(button, "danger", /*danger*/ ctx[3]);
    			toggle_class(button, "round", /*round*/ ctx[5]);
    			toggle_class(button, "neutral", /*neutral*/ ctx[4]);
    			toggle_class(button, "rectangle", /*rectangle*/ ctx[6]);
    			toggle_class(button, "small", /*small*/ ctx[7]);
    			toggle_class(button, "selected", /*selected*/ ctx[8]);
    			toggle_class(button, "svelte-86qpc", true);
    			add_location(button, file$5, 123, 2, 3213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false),
    					action_destroyer(ripple_action = ripple.call(null, button, {
    						disabled: /*noRipple*/ ctx[9] || /*disabled*/ ctx[10]
    					})),
    					action_destroyer(eventsAction_action = events.call(null, button, /*events*/ ctx[13]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				(!current || dirty & /*disabled*/ 1024) && { disabled: /*disabled*/ ctx[10] },
    				(!current || dirty & /*_class*/ 1 && button_class_value !== (button_class_value = classes('btn', /*_class*/ ctx[0]))) && { class: button_class_value },
    				dirty & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15]
    			]));

    			if (ripple_action && is_function(ripple_action.update) && dirty & /*noRipple, disabled*/ 1536) ripple_action.update.call(null, {
    				disabled: /*noRipple*/ ctx[9] || /*disabled*/ ctx[10]
    			});

    			if (eventsAction_action && is_function(eventsAction_action.update) && dirty & /*events*/ 8192) eventsAction_action.update.call(null, /*events*/ ctx[13]);
    			toggle_class(button, "filled", /*filled*/ ctx[1]);
    			toggle_class(button, "outline", /*outline*/ ctx[2]);
    			toggle_class(button, "danger", /*danger*/ ctx[3]);
    			toggle_class(button, "round", /*round*/ ctx[5]);
    			toggle_class(button, "neutral", /*neutral*/ ctx[4]);
    			toggle_class(button, "rectangle", /*rectangle*/ ctx[6]);
    			toggle_class(button, "small", /*small*/ ctx[7]);
    			toggle_class(button, "selected", /*selected*/ ctx[8]);
    			toggle_class(button, "svelte-86qpc", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(123:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (101:0) {#if href}
    function create_if_block$2(ctx) {
    	let a;
    	let a_href_value;
    	let a_rel_value;
    	let a_sapper_prefetch_value;
    	let a_disabled_value;
    	let a_class_value;
    	let eventsAction_action;
    	let ripple_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	let a_levels = [
    		{
    			href: a_href_value = /*disabled*/ ctx[10] ? null : /*href*/ ctx[11]
    		},
    		{
    			rel: a_rel_value = /*noPrefetch*/ ctx[12] ? null : 'prefetch'
    		},
    		{
    			"sapper:prefetch": a_sapper_prefetch_value = /*noPrefetch*/ ctx[12] ? null : true
    		},
    		{
    			disabled: a_disabled_value = /*disabled*/ ctx[10] ? true : null
    		},
    		{
    			class: a_class_value = classes('btn', /*_class*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[15]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "filled", /*filled*/ ctx[1]);
    			toggle_class(a, "outline", /*outline*/ ctx[2]);
    			toggle_class(a, "danger", /*danger*/ ctx[3]);
    			toggle_class(a, "round", /*round*/ ctx[5]);
    			toggle_class(a, "neutral", /*neutral*/ ctx[4]);
    			toggle_class(a, "rectangle", /*rectangle*/ ctx[6]);
    			toggle_class(a, "small", /*small*/ ctx[7]);
    			toggle_class(a, "selected", /*selected*/ ctx[8]);
    			toggle_class(a, "svelte-86qpc", true);
    			add_location(a, file$5, 101, 2, 2679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false),
    					action_destroyer(eventsAction_action = events.call(null, a, /*events*/ ctx[13])),
    					action_destroyer(ripple_action = ripple.call(null, a, {
    						disabled: /*noRipple*/ ctx[9] || /*disabled*/ ctx[10]
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*disabled, href*/ 3072 && a_href_value !== (a_href_value = /*disabled*/ ctx[10] ? null : /*href*/ ctx[11])) && { href: a_href_value },
    				(!current || dirty & /*noPrefetch*/ 4096 && a_rel_value !== (a_rel_value = /*noPrefetch*/ ctx[12] ? null : 'prefetch')) && { rel: a_rel_value },
    				(!current || dirty & /*noPrefetch*/ 4096 && a_sapper_prefetch_value !== (a_sapper_prefetch_value = /*noPrefetch*/ ctx[12] ? null : true)) && {
    					"sapper:prefetch": a_sapper_prefetch_value
    				},
    				(!current || dirty & /*disabled*/ 1024 && a_disabled_value !== (a_disabled_value = /*disabled*/ ctx[10] ? true : null)) && { disabled: a_disabled_value },
    				(!current || dirty & /*_class*/ 1 && a_class_value !== (a_class_value = classes('btn', /*_class*/ ctx[0]))) && { class: a_class_value },
    				dirty & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15]
    			]));

    			if (eventsAction_action && is_function(eventsAction_action.update) && dirty & /*events*/ 8192) eventsAction_action.update.call(null, /*events*/ ctx[13]);

    			if (ripple_action && is_function(ripple_action.update) && dirty & /*noRipple, disabled*/ 1536) ripple_action.update.call(null, {
    				disabled: /*noRipple*/ ctx[9] || /*disabled*/ ctx[10]
    			});

    			toggle_class(a, "filled", /*filled*/ ctx[1]);
    			toggle_class(a, "outline", /*outline*/ ctx[2]);
    			toggle_class(a, "danger", /*danger*/ ctx[3]);
    			toggle_class(a, "round", /*round*/ ctx[5]);
    			toggle_class(a, "neutral", /*neutral*/ ctx[4]);
    			toggle_class(a, "rectangle", /*rectangle*/ ctx[6]);
    			toggle_class(a, "small", /*small*/ ctx[7]);
    			toggle_class(a, "selected", /*selected*/ ctx[8]);
    			toggle_class(a, "svelte-86qpc", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(101:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[11]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","filled","outline","danger","neutral","round","rectangle","small","selected","noRipple","disabled","href","noPrefetch","events"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: _class = null } = $$props;
    	let { filled = false } = $$props;
    	let { outline = false } = $$props;
    	let { danger = false } = $$props;
    	let { neutral = false } = $$props;
    	let { round = false } = $$props;
    	let { rectangle = false } = $$props;
    	let { small = false } = $$props;
    	let { selected = false } = $$props;
    	let { noRipple = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = null } = $$props;
    	let { noPrefetch = false } = $$props;
    	let { events: events$1 = [] } = $$props;

    	if (filled && outline) {
    		console.error('A button may not be filled and outlined at the same time');
    	}

    	if (danger && neutral) {
    		console.error('A button may not be danger and neutral at the same time');
    	}

    	if (filled && selected) {
    		console.error('A button may not be filled and selected at the same time');
    	}

    	const dispatch = createEventDispatcher();
    	const click_handler = e => dispatch('click', { nativeEvent: e });
    	const click_handler_1 = e => dispatch('click', { nativeEvent: e });

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(0, _class = $$new_props.class);
    		if ('filled' in $$new_props) $$invalidate(1, filled = $$new_props.filled);
    		if ('outline' in $$new_props) $$invalidate(2, outline = $$new_props.outline);
    		if ('danger' in $$new_props) $$invalidate(3, danger = $$new_props.danger);
    		if ('neutral' in $$new_props) $$invalidate(4, neutral = $$new_props.neutral);
    		if ('round' in $$new_props) $$invalidate(5, round = $$new_props.round);
    		if ('rectangle' in $$new_props) $$invalidate(6, rectangle = $$new_props.rectangle);
    		if ('small' in $$new_props) $$invalidate(7, small = $$new_props.small);
    		if ('selected' in $$new_props) $$invalidate(8, selected = $$new_props.selected);
    		if ('noRipple' in $$new_props) $$invalidate(9, noRipple = $$new_props.noRipple);
    		if ('disabled' in $$new_props) $$invalidate(10, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(11, href = $$new_props.href);
    		if ('noPrefetch' in $$new_props) $$invalidate(12, noPrefetch = $$new_props.noPrefetch);
    		if ('events' in $$new_props) $$invalidate(13, events$1 = $$new_props.events);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		ripple,
    		eventsAction: events,
    		classes,
    		_class,
    		filled,
    		outline,
    		danger,
    		neutral,
    		round,
    		rectangle,
    		small,
    		selected,
    		noRipple,
    		disabled,
    		href,
    		noPrefetch,
    		events: events$1,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_class' in $$props) $$invalidate(0, _class = $$new_props._class);
    		if ('filled' in $$props) $$invalidate(1, filled = $$new_props.filled);
    		if ('outline' in $$props) $$invalidate(2, outline = $$new_props.outline);
    		if ('danger' in $$props) $$invalidate(3, danger = $$new_props.danger);
    		if ('neutral' in $$props) $$invalidate(4, neutral = $$new_props.neutral);
    		if ('round' in $$props) $$invalidate(5, round = $$new_props.round);
    		if ('rectangle' in $$props) $$invalidate(6, rectangle = $$new_props.rectangle);
    		if ('small' in $$props) $$invalidate(7, small = $$new_props.small);
    		if ('selected' in $$props) $$invalidate(8, selected = $$new_props.selected);
    		if ('noRipple' in $$props) $$invalidate(9, noRipple = $$new_props.noRipple);
    		if ('disabled' in $$props) $$invalidate(10, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(11, href = $$new_props.href);
    		if ('noPrefetch' in $$props) $$invalidate(12, noPrefetch = $$new_props.noPrefetch);
    		if ('events' in $$props) $$invalidate(13, events$1 = $$new_props.events);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		_class,
    		filled,
    		outline,
    		danger,
    		neutral,
    		round,
    		rectangle,
    		small,
    		selected,
    		noRipple,
    		disabled,
    		href,
    		noPrefetch,
    		events$1,
    		dispatch,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 0,
    			filled: 1,
    			outline: 2,
    			danger: 3,
    			neutral: 4,
    			round: 5,
    			rectangle: 6,
    			small: 7,
    			selected: 8,
    			noRipple: 9,
    			disabled: 10,
    			href: 11,
    			noPrefetch: 12,
    			events: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get danger() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set danger(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get neutral() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set neutral(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get round() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set round(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rectangle() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rectangle(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noRipple() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noRipple(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noPrefetch() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noPrefetch(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get events() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set events(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Button$1 = Button;

    let playing = writable(false);
    let looperPads = [
        {
            audioSrcUrl: "/looper/media/120_future_funk_beats_25.mp3",
        },
        {
            audioSrcUrl: "/looper/media/120_stutter_breakbeats_16.mp3",
        },
        {
            audioSrcUrl: "/looper/media/Bass Warwick heavy funk groove on E 120 BPM.mp3",
        },
        {
            audioSrcUrl: "/looper/media/electric guitar coutry slide 120bpm - B.mp3",
        },
        {
            audioSrcUrl: "/looper/media/FUD_120_StompySlosh.mp3",
        },
        {
            audioSrcUrl: "/looper/media/GrooveB_120bpm_Tanggu.mp3",
        },
        {
            audioSrcUrl: "/looper/media/MazePolitics_120_Perc.mp3",
        },
        {
            audioSrcUrl: "/looper/media/PAS3GROOVE1.03B.mp3",
        },
        {
            audioSrcUrl: "/looper/media/SilentStar_120_Em_OrganSynth.mp3",
        },
    ];
    let looperPadClickedState = writable({});

    let toggleKeyPadClickedState = (keyPadId) => {
        console.log("Clicked " + keyPadId);
        const a = looperPadClickedState;
        a[keyPadId] = !a[keyPadId];
        looperPadClickedState.set(a);
        console.log(looperPadClickedState);
    };

    for (const looperIndex in looperPads) {
        looperPads[looperIndex].id = looperIndex;
        const pad = looperPads[looperIndex];
        looperPadClickedState[pad.id] = false;
    }

    /* src/PlayControl.svelte generated by Svelte v3.42.4 */

    const { console: console_1 } = globals;

    // (11:0) <Button rectangle small on:click={togglePlaying}>
    function create_default_slot$3(ctx) {
    	let t_value = (/*$playing*/ ctx[0] ? "Stop" : "Play") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playing*/ 1 && t_value !== (t_value = (/*$playing*/ ctx[0] ? "Stop" : "Play") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(11:0) <Button rectangle small on:click={togglePlaying}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let button;
    	let current;

    	button = new Button$1({
    			props: {
    				rectangle: true,
    				small: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*togglePlaying*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope, $playing*/ 5) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $playing;
    	validate_store(playing, 'playing');
    	component_subscribe($$self, playing, $$value => $$invalidate(0, $playing = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayControl', slots, []);

    	const togglePlaying = () => {
    		console.log("toggling playing");
    		set_store_value(playing, $playing = !$playing, $playing);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<PlayControl> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button: Button$1, playing, togglePlaying, $playing });
    	return [$playing, togglePlaying];
    }

    class PlayControl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayControl",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Record.svelte generated by Svelte v3.42.4 */

    const file$4 = "src/Record.svelte";

    function create_fragment$4(ctx) {
    	let input;
    	let t;
    	let label;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t = space();
    			label = element("label");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "checkbox");
    			attr_dev(input, "class", "checkbox svelte-pleov5");
    			attr_dev(input, "id", "checkbox");
    			add_location(input, file$4, 5, 0, 22);
    			attr_dev(label, "for", "checkbox");
    			attr_dev(label, "class", "svelte-pleov5");
    			add_location(label, file$4, 6, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, label, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Record', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Record> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Record extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Record",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function throttle(func, timeFrame) {
      let lastTime = 0;
      return function (...args) {
        let now = new Date();
        if (now - lastTime >= timeFrame) {
          func(...args);
          lastTime = now;
        }
      };
    }

    function getRowsCount$1(items, cols) {
      const getItemsMaxHeight = items.map((val) => {
        const item = val[cols];

        return (item && item.y) + (item && item.h) || 0;
      });

      return Math.max(...getItemsMaxHeight, 1);
    }

    const getColumn = (containerWidth, columns) => {
      try {
        let [_, cols] = columns
          .slice()
          .reverse()
          .find((value) => {
            const [width, cols] = value;
            return containerWidth <= width;
          });
        return cols;
      } catch {
        return columns[columns.length - 1];
      }
    };

    function getContainerHeight(items, yPerPx, cols) {
      return getRowsCount$1(items, cols) * yPerPx;
    }

    const makeMatrix$1 = (rows, cols) => Array.from(Array(rows), () => new Array(cols)); // make 2d array

    function makeMatrixFromItems$1(items, _row, _col) {
      let matrix = makeMatrix$1(_row, _col);

      for (var i = 0; i < items.length; i++) {
        const value = items[i][_col];
        if (value) {
          const { x, y, h } = value;
          const id = items[i].id;
          const w = Math.min(_col, value.w);

          for (var j = y; j < y + h; j++) {
            const row = matrix[j];
            for (var k = x; k < x + w; k++) {
              row[k] = { ...value, id };
            }
          }
        }
      }
      return matrix;
    }

    function findCloseBlocks$1(items, matrix, curObject) {
      const { h, x, y } = curObject;

      const w = Math.min(matrix[0].length, curObject.w);
      const tempR = matrix.slice(y, y + h);

      let result = [];
      for (var i = 0; i < tempR.length; i++) {
        let tempA = tempR[i].slice(x, x + w);
        result = [...result, ...tempA.map((val) => val.id && val.id !== curObject.id && val.id).filter(Boolean)];
      }

      return [...new Set(result)];
    }

    function makeMatrixFromItemsIgnore$1(items, ignoreList, _row, _col) {
      let matrix = makeMatrix$1(_row, _col);
      for (var i = 0; i < items.length; i++) {
        const value = items[i][_col];
        const id = items[i].id;
        const { x, y, h } = value;
        const w = Math.min(_col, value.w);

        if (ignoreList.indexOf(id) === -1) {
          for (var j = y; j < y + h; j++) {
            const row = matrix[j];
            if (row) {
              for (var k = x; k < x + w; k++) {
                row[k] = { ...value, id };
              }
            }
          }
        }
      }
      return matrix;
    }

    function findItemsById$1(closeBlocks, items) {
      return items.filter((value) => closeBlocks.indexOf(value.id) !== -1);
    }

    function getItemById(id, items) {
      return items.find((value) => value.id === id);
    }

    function findFreeSpaceForItem$1(matrix, item) {
      const cols = matrix[0].length;
      const w = Math.min(cols, item.w);
      let xNtime = cols - w;
      let getMatrixRows = matrix.length;

      for (var i = 0; i < getMatrixRows; i++) {
        const row = matrix[i];
        for (var j = 0; j < xNtime + 1; j++) {
          const sliceA = row.slice(j, j + w);
          const empty = sliceA.every((val) => val === undefined);
          if (empty) {
            const isEmpty = matrix.slice(i, i + item.h).every((a) => a.slice(j, j + w).every((n) => n === undefined));

            if (isEmpty) {
              return { y: i, x: j };
            }
          }
        }
      }

      return {
        y: getMatrixRows,
        x: 0,
      };
    }

    const getItem$1 = (item, col) => {
      return { ...item[col], id: item.id };
    };

    const updateItem$1 = (elements, active, position, col) => {
      return elements.map((value) => {
        if (value.id === active.id) {
          return { ...value, [col]: { ...value[col], ...position } };
        }
        return value;
      });
    };

    function moveItemsAroundItem(active, items, cols, original) {
      // Get current item from the breakpoint
      const activeItem = getItem$1(active, cols);
      const ids = items.map((value) => value.id).filter((value) => value !== activeItem.id);

      const els = items.filter((value) => value.id !== activeItem.id);

      // Update items
      let newItems = updateItem$1(items, active, activeItem, cols);

      let matrix = makeMatrixFromItemsIgnore$1(newItems, ids, getRowsCount$1(newItems, cols), cols);
      let tempItems = newItems;

      // Exclude resolved elements ids in array
      let exclude = [];

      els.forEach((item) => {
        // Find position for element
        let position = findFreeSpaceForItem$1(matrix, item[cols]);
        // Exclude item
        exclude.push(item.id);

        tempItems = updateItem$1(tempItems, item, position, cols);

        // Recreate ids of elements
        let getIgnoreItems = ids.filter((value) => exclude.indexOf(value) === -1);

        // Update matrix for next iteration
        matrix = makeMatrixFromItemsIgnore$1(tempItems, getIgnoreItems, getRowsCount$1(tempItems, cols), cols);
      });

      // Return result
      return tempItems;
    }

    function moveItem$1(active, items, cols, original) {
      // Get current item from the breakpoint
      const item = getItem$1(active, cols);

      // Create matrix from the items expect the active
      let matrix = makeMatrixFromItemsIgnore$1(items, [item.id], getRowsCount$1(items, cols), cols);
      // Getting the ids of items under active Array<String>
      const closeBlocks = findCloseBlocks$1(items, matrix, item);
      // Getting the objects of items under active Array<Object>
      let closeObj = findItemsById$1(closeBlocks, items);
      // Getting whenever of these items is fixed
      const fixed = closeObj.find((value) => value[cols].fixed);

      // If found fixed, reset the active to its original position
      if (fixed) return items;

      // Update items
      items = updateItem$1(items, active, item, cols);

      // Create matrix of items expect close elements
      matrix = makeMatrixFromItemsIgnore$1(items, closeBlocks, getRowsCount$1(items, cols), cols);

      // Create temp vars
      let tempItems = items;
      let tempCloseBlocks = closeBlocks;

      // Exclude resolved elements ids in array
      let exclude = [];

      // Iterate over close elements under active item
      closeObj.forEach((item) => {
        // Find position for element
        let position = findFreeSpaceForItem$1(matrix, item[cols]);
        // Exclude item
        exclude.push(item.id);

        // Assign the position to the element in the column
        tempItems = updateItem$1(tempItems, item, position, cols);

        // Recreate ids of elements
        let getIgnoreItems = tempCloseBlocks.filter((value) => exclude.indexOf(value) === -1);

        // Update matrix for next iteration
        matrix = makeMatrixFromItemsIgnore$1(tempItems, getIgnoreItems, getRowsCount$1(tempItems, cols), cols);
      });

      // Return result
      return tempItems;
    }

    function getUndefinedItems(items, col, breakpoints) {
      return items
        .map((value) => {
          if (!value[col]) {
            return value.id;
          }
        })
        .filter(Boolean);
    }

    function getClosestColumn(items, item, col, breakpoints) {
      return breakpoints
        .map(([_, column]) => item[column] && column)
        .filter(Boolean)
        .reduce(function (acc, value) {
          const isLower = Math.abs(value - col) < Math.abs(acc - col);

          return isLower ? value : acc;
        });
    }

    function specifyUndefinedColumns(items, col, breakpoints) {
      let matrix = makeMatrixFromItems$1(items, getRowsCount$1(items, col), col);

      const getUndefinedElements = getUndefinedItems(items, col);

      let newItems = [...items];

      getUndefinedElements.forEach((elementId) => {
        const getElement = items.find((item) => item.id === elementId);

        const closestColumn = getClosestColumn(items, getElement, col, breakpoints);

        const position = findFreeSpaceForItem$1(matrix, getElement[closestColumn]);

        const newItem = {
          ...getElement,
          [col]: {
            ...getElement[closestColumn],
            ...position,
          },
        };

        newItems = newItems.map((value) => (value.id === elementId ? newItem : value));

        matrix = makeMatrixFromItems$1(newItems, getRowsCount$1(newItems, col), col);
      });
      return newItems;
    }

    /* node_modules/svelte-grid/src/MoveResize/index.svelte generated by Svelte v3.42.4 */
    const file$3 = "node_modules/svelte-grid/src/MoveResize/index.svelte";
    const get_default_slot_changes$1 = dirty => ({});

    const get_default_slot_context$1 = ctx => ({
    	movePointerDown: /*pointerdown*/ ctx[18],
    	resizePointerDown: /*resizePointerDown*/ ctx[19]
    });

    // (68:2) {#if resizable && !item.customResizer}
    function create_if_block_1$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svlt-grid-resizer svelte-x23om8");
    			add_location(div, file$3, 68, 4, 1891);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "pointerdown", /*resizePointerDown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(68:2) {#if resizable && !item.customResizer}",
    		ctx
    	});

    	return block;
    }

    // (73:0) {#if active || trans}
    function create_if_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svlt-grid-shadow shadow-active svelte-x23om8");
    			set_style(div, "width", /*shadow*/ ctx[12].w * /*xPerPx*/ ctx[6] - /*gapX*/ ctx[8] * 2 + "px");
    			set_style(div, "height", /*shadow*/ ctx[12].h * /*yPerPx*/ ctx[7] - /*gapY*/ ctx[9] * 2 + "px");
    			set_style(div, "transform", "translate(" + (/*shadow*/ ctx[12].x * /*xPerPx*/ ctx[6] + /*gapX*/ ctx[8]) + "px, " + (/*shadow*/ ctx[12].y * /*yPerPx*/ ctx[7] + /*gapY*/ ctx[9]) + "px)");
    			add_location(div, file$3, 73, 2, 2000);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[29](div);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*shadow, xPerPx, gapX*/ 4416) {
    				set_style(div, "width", /*shadow*/ ctx[12].w * /*xPerPx*/ ctx[6] - /*gapX*/ ctx[8] * 2 + "px");
    			}

    			if (dirty[0] & /*shadow, yPerPx, gapY*/ 4736) {
    				set_style(div, "height", /*shadow*/ ctx[12].h * /*yPerPx*/ ctx[7] - /*gapY*/ ctx[9] * 2 + "px");
    			}

    			if (dirty[0] & /*shadow, xPerPx, gapX, yPerPx, gapY*/ 5056) {
    				set_style(div, "transform", "translate(" + (/*shadow*/ ctx[12].x * /*xPerPx*/ ctx[6] + /*gapX*/ ctx[8]) + "px, " + (/*shadow*/ ctx[12].y * /*yPerPx*/ ctx[7] + /*gapY*/ ctx[9]) + "px)");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[29](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(73:0) {#if active || trans}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let t0;
    	let div_style_value;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[28].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[27], get_default_slot_context$1);
    	let if_block0 = /*resizable*/ ctx[4] && !/*item*/ ctx[10].customResizer && create_if_block_1$1(ctx);
    	let if_block1 = (/*active*/ ctx[13] || /*trans*/ ctx[16]) && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div, "draggable", false);
    			attr_dev(div, "class", "svlt-grid-item svelte-x23om8");

    			attr_dev(div, "style", div_style_value = "width: " + (/*active*/ ctx[13]
    			? /*newSize*/ ctx[15].width
    			: /*width*/ ctx[0]) + "px; height:" + (/*active*/ ctx[13]
    			? /*newSize*/ ctx[15].height
    			: /*height*/ ctx[1]) + "px; " + (/*active*/ ctx[13]
    			? `transform: translate(${/*cordDiff*/ ctx[14].x}px, ${/*cordDiff*/ ctx[14].y}px);top:${/*rect*/ ctx[17].top}px;left:${/*rect*/ ctx[17].left}px;`
    			: /*trans*/ ctx[16]
    				? `transform: translate(${/*cordDiff*/ ctx[14].x}px, ${/*cordDiff*/ ctx[14].y}px); position:absolute; transition: width 0.2s, height 0.2s;`
    				: `transition: transform 0.2s, opacity 0.2s; transform: translate(${/*left*/ ctx[2]}px, ${/*top*/ ctx[3]}px); `) + "");

    			toggle_class(div, "svlt-grid-active", /*active*/ ctx[13] || /*trans*/ ctx[16] && /*rect*/ ctx[17]);
    			add_location(div, file$3, 59, 0, 1178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"pointerdown",
    					function () {
    						if (is_function(/*item*/ ctx[10] && /*item*/ ctx[10].customDragger
    						? null
    						: /*draggable*/ ctx[5] && /*pointerdown*/ ctx[18])) (/*item*/ ctx[10] && /*item*/ ctx[10].customDragger
    						? null
    						: /*draggable*/ ctx[5] && /*pointerdown*/ ctx[18]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 134217728)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[27], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}

    			if (/*resizable*/ ctx[4] && !/*item*/ ctx[10].customResizer) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty[0] & /*active, newSize, width, height, cordDiff, rect, trans, left, top*/ 253967 && div_style_value !== (div_style_value = "width: " + (/*active*/ ctx[13]
    			? /*newSize*/ ctx[15].width
    			: /*width*/ ctx[0]) + "px; height:" + (/*active*/ ctx[13]
    			? /*newSize*/ ctx[15].height
    			: /*height*/ ctx[1]) + "px; " + (/*active*/ ctx[13]
    			? `transform: translate(${/*cordDiff*/ ctx[14].x}px, ${/*cordDiff*/ ctx[14].y}px);top:${/*rect*/ ctx[17].top}px;left:${/*rect*/ ctx[17].left}px;`
    			: /*trans*/ ctx[16]
    				? `transform: translate(${/*cordDiff*/ ctx[14].x}px, ${/*cordDiff*/ ctx[14].y}px); position:absolute; transition: width 0.2s, height 0.2s;`
    				: `transition: transform 0.2s, opacity 0.2s; transform: translate(${/*left*/ ctx[2]}px, ${/*top*/ ctx[3]}px); `) + "")) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty[0] & /*active, trans, rect*/ 204800) {
    				toggle_class(div, "svlt-grid-active", /*active*/ ctx[13] || /*trans*/ ctx[16] && /*rect*/ ctx[17]);
    			}

    			if (/*active*/ ctx[13] || /*trans*/ ctx[16]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MoveResize', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { sensor } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { left } = $$props;
    	let { top } = $$props;
    	let { resizable } = $$props;
    	let { draggable } = $$props;
    	let { id } = $$props;
    	let { container } = $$props;
    	let { xPerPx } = $$props;
    	let { yPerPx } = $$props;
    	let { gapX } = $$props;
    	let { gapY } = $$props;
    	let { item } = $$props;
    	let { max } = $$props;
    	let { min } = $$props;
    	let { cols } = $$props;
    	let { nativeContainer } = $$props;
    	let shadowElement;
    	let shadow = {};
    	let active = false;
    	let initX, initY;
    	let capturePos = { x: 0, y: 0 };
    	let cordDiff = { x: 0, y: 0 };
    	let newSize = { width, height };
    	let trans = false;
    	let anima;

    	const inActivate = () => {
    		const shadowBound = shadowElement.getBoundingClientRect();
    		const xdragBound = rect.left + cordDiff.x;
    		const ydragBound = rect.top + cordDiff.y;
    		$$invalidate(14, cordDiff.x = shadow.x * xPerPx + gapX - (shadowBound.x - xdragBound), cordDiff);
    		$$invalidate(14, cordDiff.y = shadow.y * yPerPx + gapY - (shadowBound.y - ydragBound), cordDiff);
    		$$invalidate(13, active = false);
    		$$invalidate(16, trans = true);
    		clearTimeout(anima);

    		anima = setTimeout(
    			() => {
    				$$invalidate(16, trans = false);
    			},
    			100
    		);

    		dispatch("pointerup", { id });
    	};

    	let repaint = (cb, isPointerUp) => {
    		dispatch("repaint", { id, shadow, isPointerUp, onUpdate: cb });
    	};

    	// Autoscroll
    	let _scrollTop = 0;

    	let containerFrame;
    	let rect;
    	let scrollElement;

    	const getContainerFrame = element => {
    		if (element === document.documentElement || !element) {
    			const { height, top, right, bottom, left } = nativeContainer.getBoundingClientRect();

    			return {
    				top: Math.max(0, top),
    				bottom: Math.min(window.innerHeight, bottom)
    			};
    		}

    		return element.getBoundingClientRect();
    	};

    	const getScroller = element => !element ? document.documentElement : element;

    	const pointerdown = ({ clientX, clientY, target }) => {
    		initX = clientX;
    		initY = clientY;
    		capturePos = { x: left, y: top };

    		$$invalidate(12, shadow = {
    			x: item.x,
    			y: item.y,
    			w: item.w,
    			h: item.h
    		});

    		$$invalidate(15, newSize = { width, height });
    		containerFrame = getContainerFrame(container);
    		scrollElement = getScroller(container);
    		$$invalidate(14, cordDiff = { x: 0, y: 0 });
    		$$invalidate(17, rect = target.closest(".svlt-grid-item").getBoundingClientRect());
    		$$invalidate(13, active = true);
    		$$invalidate(16, trans = false);
    		_scrollTop = scrollElement.scrollTop;
    		window.addEventListener("pointermove", pointermove);
    		window.addEventListener("pointerup", pointerup);
    	};

    	let sign = { x: 0, y: 0 };
    	let vel = { x: 0, y: 0 };
    	let intervalId = 0;

    	const stopAutoscroll = () => {
    		clearInterval(intervalId);
    		intervalId = false;
    		sign = { x: 0, y: 0 };
    		vel = { x: 0, y: 0 };
    	};

    	const update = () => {
    		const _newScrollTop = scrollElement.scrollTop - _scrollTop;
    		const boundX = capturePos.x + cordDiff.x;
    		const boundY = capturePos.y + (cordDiff.y + _newScrollTop);
    		let gridX = Math.round(boundX / xPerPx);
    		let gridY = Math.round(boundY / yPerPx);
    		$$invalidate(12, shadow.x = Math.max(Math.min(gridX, cols - shadow.w), 0), shadow);
    		$$invalidate(12, shadow.y = Math.max(gridY, 0), shadow);

    		if (max.y) {
    			$$invalidate(12, shadow.y = Math.min(shadow.y, max.y), shadow);
    		}

    		repaint();
    	};

    	const pointermove = event => {
    		event.preventDefault();
    		event.stopPropagation();
    		event.stopImmediatePropagation();
    		const { clientX, clientY } = event;
    		$$invalidate(14, cordDiff = { x: clientX - initX, y: clientY - initY });
    		const Y_SENSOR = sensor;
    		let velocityTop = Math.max(0, (containerFrame.top + Y_SENSOR - clientY) / Y_SENSOR);
    		let velocityBottom = Math.max(0, (clientY - (containerFrame.bottom - Y_SENSOR)) / Y_SENSOR);
    		const topSensor = velocityTop > 0 && velocityBottom === 0;
    		const bottomSensor = velocityBottom > 0 && velocityTop === 0;
    		sign.y = topSensor ? -1 : bottomSensor ? 1 : 0;
    		vel.y = sign.y === -1 ? velocityTop : velocityBottom;

    		if (vel.y > 0) {
    			if (!intervalId) {
    				// Start scrolling
    				// TODO Use requestAnimationFrame
    				intervalId = setInterval(
    					() => {
    						scrollElement.scrollTop += 2 * (vel.y + Math.sign(vel.y)) * sign.y;
    						update();
    					},
    					10
    				);
    			}
    		} else if (intervalId) {
    			stopAutoscroll();
    		} else {
    			update();
    		}
    	};

    	const pointerup = e => {
    		stopAutoscroll();
    		window.removeEventListener("pointerdown", pointerdown);
    		window.removeEventListener("pointermove", pointermove);
    		window.removeEventListener("pointerup", pointerup);
    		repaint(inActivate, true);
    	};

    	// Resize
    	let resizeInitPos = { x: 0, y: 0 };

    	let initSize = { width: 0, height: 0 };

    	const resizePointerDown = e => {
    		e.stopPropagation();
    		const { pageX, pageY } = e;
    		resizeInitPos = { x: pageX, y: pageY };
    		initSize = { width, height };
    		$$invalidate(14, cordDiff = { x: 0, y: 0 });
    		$$invalidate(17, rect = e.target.closest(".svlt-grid-item").getBoundingClientRect());
    		$$invalidate(15, newSize = { width, height });
    		$$invalidate(13, active = true);
    		$$invalidate(16, trans = false);

    		$$invalidate(12, shadow = {
    			x: item.x,
    			y: item.y,
    			w: item.w,
    			h: item.h
    		});

    		containerFrame = getContainerFrame(container);
    		scrollElement = getScroller(container);
    		window.addEventListener("pointermove", resizePointerMove);
    		window.addEventListener("pointerup", resizePointerUp);
    	};

    	const resizePointerMove = ({ pageX, pageY }) => {
    		$$invalidate(15, newSize.width = initSize.width + pageX - resizeInitPos.x, newSize);
    		$$invalidate(15, newSize.height = initSize.height + pageY - resizeInitPos.y, newSize);

    		// Get max col number
    		let maxWidth = cols - shadow.x;

    		maxWidth = Math.min(max.w, maxWidth) || maxWidth;

    		// Limit bound
    		$$invalidate(15, newSize.width = Math.max(Math.min(newSize.width, maxWidth * xPerPx - gapX * 2), min.w * xPerPx - gapX * 2), newSize);

    		$$invalidate(15, newSize.height = Math.max(newSize.height, min.h * yPerPx - gapY * 2), newSize);

    		if (max.h) {
    			$$invalidate(15, newSize.height = Math.min(newSize.height, max.h * yPerPx - gapY * 2), newSize);
    		}

    		// Limit col & row
    		$$invalidate(12, shadow.w = Math.round((newSize.width + gapX * 2) / xPerPx), shadow);

    		$$invalidate(12, shadow.h = Math.round((newSize.height + gapY * 2) / yPerPx), shadow);
    		repaint();
    	};

    	const resizePointerUp = e => {
    		e.stopPropagation();
    		repaint(inActivate, true);
    		window.removeEventListener("pointermove", resizePointerMove);
    		window.removeEventListener("pointerup", resizePointerUp);
    	};

    	const writable_props = [
    		'sensor',
    		'width',
    		'height',
    		'left',
    		'top',
    		'resizable',
    		'draggable',
    		'id',
    		'container',
    		'xPerPx',
    		'yPerPx',
    		'gapX',
    		'gapY',
    		'item',
    		'max',
    		'min',
    		'cols',
    		'nativeContainer'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MoveResize> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			shadowElement = $$value;
    			$$invalidate(11, shadowElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('sensor' in $$props) $$invalidate(20, sensor = $$props.sensor);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('left' in $$props) $$invalidate(2, left = $$props.left);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('resizable' in $$props) $$invalidate(4, resizable = $$props.resizable);
    		if ('draggable' in $$props) $$invalidate(5, draggable = $$props.draggable);
    		if ('id' in $$props) $$invalidate(21, id = $$props.id);
    		if ('container' in $$props) $$invalidate(22, container = $$props.container);
    		if ('xPerPx' in $$props) $$invalidate(6, xPerPx = $$props.xPerPx);
    		if ('yPerPx' in $$props) $$invalidate(7, yPerPx = $$props.yPerPx);
    		if ('gapX' in $$props) $$invalidate(8, gapX = $$props.gapX);
    		if ('gapY' in $$props) $$invalidate(9, gapY = $$props.gapY);
    		if ('item' in $$props) $$invalidate(10, item = $$props.item);
    		if ('max' in $$props) $$invalidate(23, max = $$props.max);
    		if ('min' in $$props) $$invalidate(24, min = $$props.min);
    		if ('cols' in $$props) $$invalidate(25, cols = $$props.cols);
    		if ('nativeContainer' in $$props) $$invalidate(26, nativeContainer = $$props.nativeContainer);
    		if ('$$scope' in $$props) $$invalidate(27, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		sensor,
    		width,
    		height,
    		left,
    		top,
    		resizable,
    		draggable,
    		id,
    		container,
    		xPerPx,
    		yPerPx,
    		gapX,
    		gapY,
    		item,
    		max,
    		min,
    		cols,
    		nativeContainer,
    		shadowElement,
    		shadow,
    		active,
    		initX,
    		initY,
    		capturePos,
    		cordDiff,
    		newSize,
    		trans,
    		anima,
    		inActivate,
    		repaint,
    		_scrollTop,
    		containerFrame,
    		rect,
    		scrollElement,
    		getContainerFrame,
    		getScroller,
    		pointerdown,
    		sign,
    		vel,
    		intervalId,
    		stopAutoscroll,
    		update,
    		pointermove,
    		pointerup,
    		resizeInitPos,
    		initSize,
    		resizePointerDown,
    		resizePointerMove,
    		resizePointerUp
    	});

    	$$self.$inject_state = $$props => {
    		if ('sensor' in $$props) $$invalidate(20, sensor = $$props.sensor);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('left' in $$props) $$invalidate(2, left = $$props.left);
    		if ('top' in $$props) $$invalidate(3, top = $$props.top);
    		if ('resizable' in $$props) $$invalidate(4, resizable = $$props.resizable);
    		if ('draggable' in $$props) $$invalidate(5, draggable = $$props.draggable);
    		if ('id' in $$props) $$invalidate(21, id = $$props.id);
    		if ('container' in $$props) $$invalidate(22, container = $$props.container);
    		if ('xPerPx' in $$props) $$invalidate(6, xPerPx = $$props.xPerPx);
    		if ('yPerPx' in $$props) $$invalidate(7, yPerPx = $$props.yPerPx);
    		if ('gapX' in $$props) $$invalidate(8, gapX = $$props.gapX);
    		if ('gapY' in $$props) $$invalidate(9, gapY = $$props.gapY);
    		if ('item' in $$props) $$invalidate(10, item = $$props.item);
    		if ('max' in $$props) $$invalidate(23, max = $$props.max);
    		if ('min' in $$props) $$invalidate(24, min = $$props.min);
    		if ('cols' in $$props) $$invalidate(25, cols = $$props.cols);
    		if ('nativeContainer' in $$props) $$invalidate(26, nativeContainer = $$props.nativeContainer);
    		if ('shadowElement' in $$props) $$invalidate(11, shadowElement = $$props.shadowElement);
    		if ('shadow' in $$props) $$invalidate(12, shadow = $$props.shadow);
    		if ('active' in $$props) $$invalidate(13, active = $$props.active);
    		if ('initX' in $$props) initX = $$props.initX;
    		if ('initY' in $$props) initY = $$props.initY;
    		if ('capturePos' in $$props) capturePos = $$props.capturePos;
    		if ('cordDiff' in $$props) $$invalidate(14, cordDiff = $$props.cordDiff);
    		if ('newSize' in $$props) $$invalidate(15, newSize = $$props.newSize);
    		if ('trans' in $$props) $$invalidate(16, trans = $$props.trans);
    		if ('anima' in $$props) anima = $$props.anima;
    		if ('repaint' in $$props) repaint = $$props.repaint;
    		if ('_scrollTop' in $$props) _scrollTop = $$props._scrollTop;
    		if ('containerFrame' in $$props) containerFrame = $$props.containerFrame;
    		if ('rect' in $$props) $$invalidate(17, rect = $$props.rect);
    		if ('scrollElement' in $$props) scrollElement = $$props.scrollElement;
    		if ('sign' in $$props) sign = $$props.sign;
    		if ('vel' in $$props) vel = $$props.vel;
    		if ('intervalId' in $$props) intervalId = $$props.intervalId;
    		if ('resizeInitPos' in $$props) resizeInitPos = $$props.resizeInitPos;
    		if ('initSize' in $$props) initSize = $$props.initSize;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		height,
    		left,
    		top,
    		resizable,
    		draggable,
    		xPerPx,
    		yPerPx,
    		gapX,
    		gapY,
    		item,
    		shadowElement,
    		shadow,
    		active,
    		cordDiff,
    		newSize,
    		trans,
    		rect,
    		pointerdown,
    		resizePointerDown,
    		sensor,
    		id,
    		container,
    		max,
    		min,
    		cols,
    		nativeContainer,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class MoveResize extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				sensor: 20,
    				width: 0,
    				height: 1,
    				left: 2,
    				top: 3,
    				resizable: 4,
    				draggable: 5,
    				id: 21,
    				container: 22,
    				xPerPx: 6,
    				yPerPx: 7,
    				gapX: 8,
    				gapY: 9,
    				item: 10,
    				max: 23,
    				min: 24,
    				cols: 25,
    				nativeContainer: 26
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MoveResize",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sensor*/ ctx[20] === undefined && !('sensor' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'sensor'");
    		}

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'height'");
    		}

    		if (/*left*/ ctx[2] === undefined && !('left' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'left'");
    		}

    		if (/*top*/ ctx[3] === undefined && !('top' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'top'");
    		}

    		if (/*resizable*/ ctx[4] === undefined && !('resizable' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'resizable'");
    		}

    		if (/*draggable*/ ctx[5] === undefined && !('draggable' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'draggable'");
    		}

    		if (/*id*/ ctx[21] === undefined && !('id' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'id'");
    		}

    		if (/*container*/ ctx[22] === undefined && !('container' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'container'");
    		}

    		if (/*xPerPx*/ ctx[6] === undefined && !('xPerPx' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'xPerPx'");
    		}

    		if (/*yPerPx*/ ctx[7] === undefined && !('yPerPx' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'yPerPx'");
    		}

    		if (/*gapX*/ ctx[8] === undefined && !('gapX' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'gapX'");
    		}

    		if (/*gapY*/ ctx[9] === undefined && !('gapY' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'gapY'");
    		}

    		if (/*item*/ ctx[10] === undefined && !('item' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'item'");
    		}

    		if (/*max*/ ctx[23] === undefined && !('max' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'max'");
    		}

    		if (/*min*/ ctx[24] === undefined && !('min' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'min'");
    		}

    		if (/*cols*/ ctx[25] === undefined && !('cols' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'cols'");
    		}

    		if (/*nativeContainer*/ ctx[26] === undefined && !('nativeContainer' in props)) {
    			console.warn("<MoveResize> was created without expected prop 'nativeContainer'");
    		}
    	}

    	get sensor() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sensor(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resizable() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resizable(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get draggable() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set draggable(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPerPx() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPerPx(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPerPx() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPerPx(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gapX() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gapX(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gapY() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gapY(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nativeContainer() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nativeContainer(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-grid/src/index.svelte generated by Svelte v3.42.4 */
    const file$2 = "node_modules/svelte-grid/src/index.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({
    	movePointerDown: dirty[1] & /*movePointerDown*/ 2,
    	resizePointerDown: dirty[1] & /*resizePointerDown*/ 1,
    	dataItem: dirty[0] & /*items*/ 1,
    	item: dirty[0] & /*items, getComputedCols*/ 17,
    	index: dirty[0] & /*items*/ 1
    });

    const get_default_slot_context = ctx => ({
    	movePointerDown: /*movePointerDown*/ ctx[32],
    	resizePointerDown: /*resizePointerDown*/ ctx[31],
    	dataItem: /*item*/ ctx[28],
    	item: /*item*/ ctx[28][/*getComputedCols*/ ctx[4]],
    	index: /*i*/ ctx[30]
    });

    // (8:2) {#if xPerPx || !fastStart}
    function create_if_block(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[28].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, getComputedCols, xPerPx, yPerPx, gapX, gapY, sensor, scroller, container, handleRepaint, pointerup, $$scope*/ 2105213 | dirty[1] & /*movePointerDown, resizePointerDown*/ 3) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(8:2) {#if xPerPx || !fastStart}",
    		ctx
    	});

    	return block;
    }

    // (33:8) {#if item[getComputedCols]}
    function create_if_block_1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, items, getComputedCols*/ 2097169 | dirty[1] & /*movePointerDown, resizePointerDown*/ 3)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(33:8) {#if item[getComputedCols]}",
    		ctx
    	});

    	return block;
    }

    // (10:6) <MoveResize         on:repaint={handleRepaint}         on:pointerup={pointerup}         id={item.id}         resizable={item[getComputedCols] && item[getComputedCols].resizable}         draggable={item[getComputedCols] && item[getComputedCols].draggable}         {xPerPx}         {yPerPx}         width={Math.min(getComputedCols, item[getComputedCols] && item[getComputedCols].w) * xPerPx - gapX * 2}         height={(item[getComputedCols] && item[getComputedCols].h) * yPerPx - gapY * 2}         top={(item[getComputedCols] && item[getComputedCols].y) * yPerPx + gapY}         left={(item[getComputedCols] && item[getComputedCols].x) * xPerPx + gapX}         item={item[getComputedCols]}         min={item[getComputedCols] && item[getComputedCols].min}         max={item[getComputedCols] && item[getComputedCols].max}         cols={getComputedCols}         {gapX}         {gapY}         {sensor}         container={scroller}         nativeContainer={container}         let:resizePointerDown         let:movePointerDown>
    function create_default_slot$2(ctx) {
    	let t;
    	let current;
    	let if_block = /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[28][/*getComputedCols*/ ctx[4]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*items, getComputedCols*/ 17) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(10:6) <MoveResize         on:repaint={handleRepaint}         on:pointerup={pointerup}         id={item.id}         resizable={item[getComputedCols] && item[getComputedCols].resizable}         draggable={item[getComputedCols] && item[getComputedCols].draggable}         {xPerPx}         {yPerPx}         width={Math.min(getComputedCols, item[getComputedCols] && item[getComputedCols].w) * xPerPx - gapX * 2}         height={(item[getComputedCols] && item[getComputedCols].h) * yPerPx - gapY * 2}         top={(item[getComputedCols] && item[getComputedCols].y) * yPerPx + gapY}         left={(item[getComputedCols] && item[getComputedCols].x) * xPerPx + gapX}         item={item[getComputedCols]}         min={item[getComputedCols] && item[getComputedCols].min}         max={item[getComputedCols] && item[getComputedCols].max}         cols={getComputedCols}         {gapX}         {gapY}         {sensor}         container={scroller}         nativeContainer={container}         let:resizePointerDown         let:movePointerDown>",
    		ctx
    	});

    	return block;
    }

    // (9:4) {#each items as item, i (item.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let moveresize;
    	let current;

    	moveresize = new MoveResize({
    			props: {
    				id: /*item*/ ctx[28].id,
    				resizable: /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].resizable,
    				draggable: /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].draggable,
    				xPerPx: /*xPerPx*/ ctx[6],
    				yPerPx: /*yPerPx*/ ctx[10],
    				width: Math.min(/*getComputedCols*/ ctx[4], /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].w) * /*xPerPx*/ ctx[6] - /*gapX*/ ctx[9] * 2,
    				height: (/*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].h) * /*yPerPx*/ ctx[10] - /*gapY*/ ctx[8] * 2,
    				top: (/*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].y) * /*yPerPx*/ ctx[10] + /*gapY*/ ctx[8],
    				left: (/*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].x) * /*xPerPx*/ ctx[6] + /*gapX*/ ctx[9],
    				item: /*item*/ ctx[28][/*getComputedCols*/ ctx[4]],
    				min: /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].min,
    				max: /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].max,
    				cols: /*getComputedCols*/ ctx[4],
    				gapX: /*gapX*/ ctx[9],
    				gapY: /*gapY*/ ctx[8],
    				sensor: /*sensor*/ ctx[3],
    				container: /*scroller*/ ctx[2],
    				nativeContainer: /*container*/ ctx[5],
    				$$slots: {
    					default: [
    						create_default_slot$2,
    						({ resizePointerDown, movePointerDown }) => ({
    							31: resizePointerDown,
    							32: movePointerDown
    						}),
    						({ resizePointerDown, movePointerDown }) => [0, (resizePointerDown ? 1 : 0) | (movePointerDown ? 2 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	moveresize.$on("repaint", /*handleRepaint*/ ctx[12]);
    	moveresize.$on("pointerup", /*pointerup*/ ctx[11]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(moveresize.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(moveresize, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const moveresize_changes = {};
    			if (dirty[0] & /*items*/ 1) moveresize_changes.id = /*item*/ ctx[28].id;
    			if (dirty[0] & /*items, getComputedCols*/ 17) moveresize_changes.resizable = /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].resizable;
    			if (dirty[0] & /*items, getComputedCols*/ 17) moveresize_changes.draggable = /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].draggable;
    			if (dirty[0] & /*xPerPx*/ 64) moveresize_changes.xPerPx = /*xPerPx*/ ctx[6];
    			if (dirty[0] & /*getComputedCols, items, xPerPx, gapX*/ 593) moveresize_changes.width = Math.min(/*getComputedCols*/ ctx[4], /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].w) * /*xPerPx*/ ctx[6] - /*gapX*/ ctx[9] * 2;
    			if (dirty[0] & /*items, getComputedCols, gapY*/ 273) moveresize_changes.height = (/*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].h) * /*yPerPx*/ ctx[10] - /*gapY*/ ctx[8] * 2;
    			if (dirty[0] & /*items, getComputedCols, gapY*/ 273) moveresize_changes.top = (/*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].y) * /*yPerPx*/ ctx[10] + /*gapY*/ ctx[8];
    			if (dirty[0] & /*items, getComputedCols, xPerPx, gapX*/ 593) moveresize_changes.left = (/*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].x) * /*xPerPx*/ ctx[6] + /*gapX*/ ctx[9];
    			if (dirty[0] & /*items, getComputedCols*/ 17) moveresize_changes.item = /*item*/ ctx[28][/*getComputedCols*/ ctx[4]];
    			if (dirty[0] & /*items, getComputedCols*/ 17) moveresize_changes.min = /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].min;
    			if (dirty[0] & /*items, getComputedCols*/ 17) moveresize_changes.max = /*item*/ ctx[28][/*getComputedCols*/ ctx[4]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[4]].max;
    			if (dirty[0] & /*getComputedCols*/ 16) moveresize_changes.cols = /*getComputedCols*/ ctx[4];
    			if (dirty[0] & /*gapX*/ 512) moveresize_changes.gapX = /*gapX*/ ctx[9];
    			if (dirty[0] & /*gapY*/ 256) moveresize_changes.gapY = /*gapY*/ ctx[8];
    			if (dirty[0] & /*sensor*/ 8) moveresize_changes.sensor = /*sensor*/ ctx[3];
    			if (dirty[0] & /*scroller*/ 4) moveresize_changes.container = /*scroller*/ ctx[2];
    			if (dirty[0] & /*container*/ 32) moveresize_changes.nativeContainer = /*container*/ ctx[5];

    			if (dirty[0] & /*$$scope, items, getComputedCols*/ 2097169 | dirty[1] & /*movePointerDown, resizePointerDown*/ 3) {
    				moveresize_changes.$$scope = { dirty, ctx };
    			}

    			moveresize.$set(moveresize_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(moveresize.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(moveresize.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(moveresize, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(9:4) {#each items as item, i (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	let if_block = (/*xPerPx*/ ctx[6] || !/*fastStart*/ ctx[1]) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "svlt-grid-container svelte-p0xk9p");
    			set_style(div, "height", /*containerHeight*/ ctx[7] + "px");
    			add_location(div, file$2, 6, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[20](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*xPerPx*/ ctx[6] || !/*fastStart*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*xPerPx, fastStart*/ 66) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*containerHeight*/ 128) {
    				set_style(div, "height", /*containerHeight*/ ctx[7] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let gapX;
    	let gapY;
    	let containerHeight;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Src', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { fillSpace = false } = $$props;
    	let { items } = $$props;
    	let { rowHeight } = $$props;
    	let { cols } = $$props;
    	let { gap = [10, 10] } = $$props;
    	let { fastStart = false } = $$props;
    	let { throttleUpdate = 100 } = $$props;
    	let { throttleResize = 100 } = $$props;
    	let { scroller = undefined } = $$props;
    	let { sensor = 20 } = $$props;
    	let getComputedCols;
    	let container;
    	let xPerPx = 0;
    	let yPerPx = rowHeight;
    	let documentWidth;
    	let containerWidth;

    	const pointerup = ev => {
    		dispatch("pointerup", { id: ev.detail.id, cols: getComputedCols });
    	};

    	const onResize = throttle(
    		() => {
    			$$invalidate(0, items = specifyUndefinedColumns(items, getComputedCols, cols));

    			dispatch("resize", {
    				cols: getComputedCols,
    				xPerPx,
    				yPerPx,
    				width: containerWidth
    			});
    		},
    		throttleUpdate
    	);

    	onMount(() => {
    		const sizeObserver = new ResizeObserver(entries => {
    				let width = entries[0].contentRect.width;
    				if (width === containerWidth) return;
    				$$invalidate(4, getComputedCols = getColumn(width, cols));
    				$$invalidate(6, xPerPx = width / getComputedCols);

    				if (!containerWidth) {
    					$$invalidate(0, items = specifyUndefinedColumns(items, getComputedCols, cols));
    					dispatch("mount", { cols: getComputedCols, xPerPx, yPerPx });
    				} else {
    					onResize();
    				}

    				containerWidth = width;
    			});

    		sizeObserver.observe(container);
    		return () => sizeObserver.disconnect();
    	});

    	const updateMatrix = ({ detail }) => {
    		let activeItem = getItemById(detail.id, items);

    		if (activeItem) {
    			activeItem = {
    				...activeItem,
    				[getComputedCols]: {
    					...activeItem[getComputedCols],
    					...detail.shadow
    				}
    			};

    			if (fillSpace) {
    				$$invalidate(0, items = moveItemsAroundItem(activeItem, items, getComputedCols, getItemById(detail.id, items)));
    			} else {
    				$$invalidate(0, items = moveItem$1(activeItem, items, getComputedCols, getItemById(detail.id, items)));
    			}

    			if (detail.onUpdate) detail.onUpdate();

    			dispatch("change", {
    				unsafeItem: activeItem,
    				id: activeItem.id,
    				cols: getComputedCols
    			});
    		}
    	};

    	const throttleMatrix = throttle(updateMatrix, throttleResize);

    	const handleRepaint = ({ detail }) => {
    		if (!detail.isPointerUp) {
    			throttleMatrix({ detail });
    		} else {
    			updateMatrix({ detail });
    		}
    	};

    	const writable_props = [
    		'fillSpace',
    		'items',
    		'rowHeight',
    		'cols',
    		'gap',
    		'fastStart',
    		'throttleUpdate',
    		'throttleResize',
    		'scroller',
    		'sensor'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Src> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(5, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('fillSpace' in $$props) $$invalidate(13, fillSpace = $$props.fillSpace);
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('rowHeight' in $$props) $$invalidate(14, rowHeight = $$props.rowHeight);
    		if ('cols' in $$props) $$invalidate(15, cols = $$props.cols);
    		if ('gap' in $$props) $$invalidate(16, gap = $$props.gap);
    		if ('fastStart' in $$props) $$invalidate(1, fastStart = $$props.fastStart);
    		if ('throttleUpdate' in $$props) $$invalidate(17, throttleUpdate = $$props.throttleUpdate);
    		if ('throttleResize' in $$props) $$invalidate(18, throttleResize = $$props.throttleResize);
    		if ('scroller' in $$props) $$invalidate(2, scroller = $$props.scroller);
    		if ('sensor' in $$props) $$invalidate(3, sensor = $$props.sensor);
    		if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContainerHeight,
    		moveItemsAroundItem,
    		moveItem: moveItem$1,
    		getItemById,
    		specifyUndefinedColumns,
    		findFreeSpaceForItem: findFreeSpaceForItem$1,
    		onMount,
    		createEventDispatcher,
    		getColumn,
    		getRowsCount: getRowsCount$1,
    		throttle,
    		makeMatrixFromItems: makeMatrixFromItems$1,
    		MoveResize,
    		dispatch,
    		fillSpace,
    		items,
    		rowHeight,
    		cols,
    		gap,
    		fastStart,
    		throttleUpdate,
    		throttleResize,
    		scroller,
    		sensor,
    		getComputedCols,
    		container,
    		xPerPx,
    		yPerPx,
    		documentWidth,
    		containerWidth,
    		pointerup,
    		onResize,
    		updateMatrix,
    		throttleMatrix,
    		handleRepaint,
    		containerHeight,
    		gapY,
    		gapX
    	});

    	$$self.$inject_state = $$props => {
    		if ('fillSpace' in $$props) $$invalidate(13, fillSpace = $$props.fillSpace);
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('rowHeight' in $$props) $$invalidate(14, rowHeight = $$props.rowHeight);
    		if ('cols' in $$props) $$invalidate(15, cols = $$props.cols);
    		if ('gap' in $$props) $$invalidate(16, gap = $$props.gap);
    		if ('fastStart' in $$props) $$invalidate(1, fastStart = $$props.fastStart);
    		if ('throttleUpdate' in $$props) $$invalidate(17, throttleUpdate = $$props.throttleUpdate);
    		if ('throttleResize' in $$props) $$invalidate(18, throttleResize = $$props.throttleResize);
    		if ('scroller' in $$props) $$invalidate(2, scroller = $$props.scroller);
    		if ('sensor' in $$props) $$invalidate(3, sensor = $$props.sensor);
    		if ('getComputedCols' in $$props) $$invalidate(4, getComputedCols = $$props.getComputedCols);
    		if ('container' in $$props) $$invalidate(5, container = $$props.container);
    		if ('xPerPx' in $$props) $$invalidate(6, xPerPx = $$props.xPerPx);
    		if ('yPerPx' in $$props) $$invalidate(10, yPerPx = $$props.yPerPx);
    		if ('documentWidth' in $$props) documentWidth = $$props.documentWidth;
    		if ('containerWidth' in $$props) containerWidth = $$props.containerWidth;
    		if ('containerHeight' in $$props) $$invalidate(7, containerHeight = $$props.containerHeight);
    		if ('gapY' in $$props) $$invalidate(8, gapY = $$props.gapY);
    		if ('gapX' in $$props) $$invalidate(9, gapX = $$props.gapX);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*gap*/ 65536) {
    			$$invalidate(9, [gapX, gapY] = gap, gapX, ($$invalidate(8, gapY), $$invalidate(16, gap)));
    		}

    		if ($$self.$$.dirty[0] & /*items, getComputedCols*/ 17) {
    			$$invalidate(7, containerHeight = getContainerHeight(items, yPerPx, getComputedCols));
    		}
    	};

    	return [
    		items,
    		fastStart,
    		scroller,
    		sensor,
    		getComputedCols,
    		container,
    		xPerPx,
    		containerHeight,
    		gapY,
    		gapX,
    		yPerPx,
    		pointerup,
    		handleRepaint,
    		fillSpace,
    		rowHeight,
    		cols,
    		gap,
    		throttleUpdate,
    		throttleResize,
    		slots,
    		div_binding,
    		$$scope
    	];
    }

    class Src extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				fillSpace: 13,
    				items: 0,
    				rowHeight: 14,
    				cols: 15,
    				gap: 16,
    				fastStart: 1,
    				throttleUpdate: 17,
    				throttleResize: 18,
    				scroller: 2,
    				sensor: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !('items' in props)) {
    			console.warn("<Src> was created without expected prop 'items'");
    		}

    		if (/*rowHeight*/ ctx[14] === undefined && !('rowHeight' in props)) {
    			console.warn("<Src> was created without expected prop 'rowHeight'");
    		}

    		if (/*cols*/ ctx[15] === undefined && !('cols' in props)) {
    			console.warn("<Src> was created without expected prop 'cols'");
    		}
    	}

    	get fillSpace() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillSpace(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowHeight() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowHeight(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gap() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gap(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fastStart() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fastStart(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get throttleUpdate() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set throttleUpdate(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get throttleResize() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set throttleResize(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scroller() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scroller(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sensor() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sensor(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getRowsCount(items, cols) {
      const getItemsMaxHeight = items.map((val) => {
        const item = val[cols];

        return (item && item.y) + (item && item.h) || 0;
      });

      return Math.max(...getItemsMaxHeight, 1);
    }

    const makeMatrix = (rows, cols) => Array.from(Array(rows), () => new Array(cols)); // make 2d array

    function makeMatrixFromItems(items, _row, _col) {
      let matrix = makeMatrix(_row, _col);

      for (var i = 0; i < items.length; i++) {
        const value = items[i][_col];
        if (value) {
          const { x, y, h } = value;
          const id = items[i].id;
          const w = Math.min(_col, value.w);

          for (var j = y; j < y + h; j++) {
            const row = matrix[j];
            for (var k = x; k < x + w; k++) {
              row[k] = { ...value, id };
            }
          }
        }
      }
      return matrix;
    }

    function findCloseBlocks(items, matrix, curObject) {
      const { h, x, y } = curObject;

      const w = Math.min(matrix[0].length, curObject.w);
      const tempR = matrix.slice(y, y + h);

      let result = [];
      for (var i = 0; i < tempR.length; i++) {
        let tempA = tempR[i].slice(x, x + w);
        result = [...result, ...tempA.map((val) => val.id && val.id !== curObject.id && val.id).filter(Boolean)];
      }

      return [...new Set(result)];
    }

    function makeMatrixFromItemsIgnore(items, ignoreList, _row, _col) {
      let matrix = makeMatrix(_row, _col);
      for (var i = 0; i < items.length; i++) {
        const value = items[i][_col];
        const id = items[i].id;
        const { x, y, h } = value;
        const w = Math.min(_col, value.w);

        if (ignoreList.indexOf(id) === -1) {
          for (var j = y; j < y + h; j++) {
            const row = matrix[j];
            if (row) {
              for (var k = x; k < x + w; k++) {
                row[k] = { ...value, id };
              }
            }
          }
        }
      }
      return matrix;
    }

    function findItemsById(closeBlocks, items) {
      return items.filter((value) => closeBlocks.indexOf(value.id) !== -1);
    }

    function findFreeSpaceForItem(matrix, item) {
      const cols = matrix[0].length;
      const w = Math.min(cols, item.w);
      let xNtime = cols - w;
      let getMatrixRows = matrix.length;

      for (var i = 0; i < getMatrixRows; i++) {
        const row = matrix[i];
        for (var j = 0; j < xNtime + 1; j++) {
          const sliceA = row.slice(j, j + w);
          const empty = sliceA.every((val) => val === undefined);
          if (empty) {
            const isEmpty = matrix.slice(i, i + item.h).every((a) => a.slice(j, j + w).every((n) => n === undefined));

            if (isEmpty) {
              return { y: i, x: j };
            }
          }
        }
      }

      return {
        y: getMatrixRows,
        x: 0,
      };
    }

    const getItem = (item, col) => {
      return { ...item[col], id: item.id };
    };

    const updateItem = (elements, active, position, col) => {
      return elements.map((value) => {
        if (value.id === active.id) {
          return { ...value, [col]: { ...value[col], ...position } };
        }
        return value;
      });
    };

    function moveItem(active, items, cols, original) {
      // Get current item from the breakpoint
      const item = getItem(active, cols);

      // Create matrix from the items expect the active
      let matrix = makeMatrixFromItemsIgnore(items, [item.id], getRowsCount(items, cols), cols);
      // Getting the ids of items under active Array<String>
      const closeBlocks = findCloseBlocks(items, matrix, item);
      // Getting the objects of items under active Array<Object>
      let closeObj = findItemsById(closeBlocks, items);
      // Getting whenever of these items is fixed
      const fixed = closeObj.find((value) => value[cols].fixed);

      // If found fixed, reset the active to its original position
      if (fixed) return items;

      // Update items
      items = updateItem(items, active, item, cols);

      // Create matrix of items expect close elements
      matrix = makeMatrixFromItemsIgnore(items, closeBlocks, getRowsCount(items, cols), cols);

      // Create temp vars
      let tempItems = items;
      let tempCloseBlocks = closeBlocks;

      // Exclude resolved elements ids in array
      let exclude = [];

      // Iterate over close elements under active item
      closeObj.forEach((item) => {
        // Find position for element
        let position = findFreeSpaceForItem(matrix, item[cols]);
        // Exclude item
        exclude.push(item.id);

        // Assign the position to the element in the column
        tempItems = updateItem(tempItems, item, position, cols);

        // Recreate ids of elements
        let getIgnoreItems = tempCloseBlocks.filter((value) => exclude.indexOf(value) === -1);

        // Update matrix for next iteration
        matrix = makeMatrixFromItemsIgnore(tempItems, getIgnoreItems, getRowsCount(tempItems, cols), cols);
      });

      // Return result
      return tempItems;
    }

    // Helper function
    function normalize(items, col) {
      let result = items.slice();

      result.forEach((value) => {
        const getItem = value[col];
        if (!getItem.static) {
          result = moveItem(getItem, result, col);
        }
      });

      return result;
    }

    // Helper function
    function adjust(items, col) {
      let matrix = makeMatrix(getRowsCount(items, col), col);

      let res = [];

      items.forEach((item) => {
        let position = findFreeSpaceForItem(matrix, item[col]);

        res.push({
          ...item,
          [col]: {
            ...item[col],
            ...position,
          },
        });

        matrix = makeMatrixFromItems(res, getRowsCount(res, col), col);
      });

      return res;
    }

    function makeItem(item) {
      const { min = { w: 1, h: 1 }, max } = item;
      return {
        fixed: false,
        resizable: !item.fixed,
        draggable: !item.fixed,
        customDragger: false,
        customResizer: false,
        min: {
          w: Math.max(1, min.w),
          h: Math.max(1, min.h),
        },
        max: { ...max },
        ...item,
      };
    }

    const gridHelp = {
      normalize(items, col) {
        getRowsCount(items, col);
        return normalize(items, col);
      },

      adjust(items, col) {
        return adjust(items, col);
      },

      item(obj) {
        return makeItem(obj);
      },

      findSpace(item, items, cols) {
        let matrix = makeMatrixFromItems(items, getRowsCount(items, cols), cols);

        let position = findFreeSpaceForItem(matrix, item[cols]);
        return position;
      },
    };

    const id = () => "_" + Math.random().toString(36).substr(2, 9);
    const randomHexColorCode = () => {
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return "#" + n.slice(0, 6);
    };

    /* src/KeyPads.svelte generated by Svelte v3.42.4 */

    const file$1 = "src/KeyPads.svelte";

    // (45:0) <Grid bind:items {cols} rowHeight={50} let:dataItem fillSpace={true}>
    function create_default_slot$1(ctx) {
    	let audio;
    	let audio_src_value;
    	let dataItem = /*dataItem*/ ctx[11];
    	let audio_is_paused = true;
    	let t0;
    	let a;
    	let div;
    	let h2;

    	let t1_value = (/*$looperPadClickedState*/ ctx[3][/*dataItem*/ ctx[11].data.looperPad.id]
    	? 'Playing'
    	: '') + "";

    	let t1;
    	let div_class_value;
    	let mounted;
    	let dispose;
    	const assign_audio = () => /*audio_binding*/ ctx[5](audio, dataItem);
    	const unassign_audio = () => /*audio_binding*/ ctx[5](null, dataItem);

    	function audio_play_pause_handler() {
    		/*audio_play_pause_handler*/ ctx[6].call(audio, /*dataItem*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			audio = element("audio");
    			t0 = space();
    			a = element("a");
    			div = element("div");
    			h2 = element("h2");
    			t1 = text(t1_value);
    			audio.loop = true;
    			if (!src_url_equal(audio.src, audio_src_value = /*dataItem*/ ctx[11].data.looperPad.audioSrcUrl)) attr_dev(audio, "src", audio_src_value);
    			add_location(audio, file$1, 45, 2, 1285);
    			set_style(h2, "padding-top", "10%");
    			set_style(h2, "color", "black");
    			add_location(h2, file$1, 56, 6, 1801);

    			attr_dev(div, "class", div_class_value = "content " + (/*$looperPadClickedState*/ ctx[3][/*dataItem*/ ctx[11].data.looperPad.id]
    			? 'greyout'
    			: '') + " svelte-pimmlo");

    			set_style(div, "background-image", "linear-gradient(" + /*dataItem*/ ctx[11].data.start + ", " + /*dataItem*/ ctx[11].data.end + ")");
    			add_location(div, file$1, 53, 4, 1524);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "svelte-pimmlo");
    			add_location(a, file$1, 52, 2, 1507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, audio, anchor);
    			assign_audio();
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(div, h2);
    			append_dev(h2, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(audio, "play", audio_play_pause_handler),
    					listen_dev(audio, "pause", audio_play_pause_handler),
    					listen_dev(
    						div,
    						"click",
    						function () {
    							if (is_function(toggleKeyPadClickedState.bind(this, /*dataItem*/ ctx[11].data.looperPad.id))) toggleKeyPadClickedState.bind(this, /*dataItem*/ ctx[11].data.looperPad.id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*dataItem*/ 2048 && !src_url_equal(audio.src, audio_src_value = /*dataItem*/ ctx[11].data.looperPad.audioSrcUrl)) {
    				attr_dev(audio, "src", audio_src_value);
    			}

    			if (dataItem !== /*dataItem*/ ctx[11]) {
    				unassign_audio();
    				dataItem = /*dataItem*/ ctx[11];
    				assign_audio();
    			}

    			if (dirty & /*looperKeyPausedState, dataItem*/ 2050 && audio_is_paused !== (audio_is_paused = /*looperKeyPausedState*/ ctx[1][/*dataItem*/ ctx[11].data.looperPad.id])) {
    				audio[audio_is_paused ? "pause" : "play"]();
    			}

    			if (dirty & /*$looperPadClickedState, dataItem*/ 2056 && t1_value !== (t1_value = (/*$looperPadClickedState*/ ctx[3][/*dataItem*/ ctx[11].data.looperPad.id]
    			? 'Playing'
    			: '') + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$looperPadClickedState, dataItem*/ 2056 && div_class_value !== (div_class_value = "content " + (/*$looperPadClickedState*/ ctx[3][/*dataItem*/ ctx[11].data.looperPad.id]
    			? 'greyout'
    			: '') + " svelte-pimmlo")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*dataItem*/ 2048) {
    				set_style(div, "background-image", "linear-gradient(" + /*dataItem*/ ctx[11].data.start + ", " + /*dataItem*/ ctx[11].data.end + ")");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(audio);
    			unassign_audio();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(45:0) <Grid bind:items {cols} rowHeight={50} let:dataItem fillSpace={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let grid;
    	let updating_items;
    	let current;

    	function grid_items_binding(value) {
    		/*grid_items_binding*/ ctx[7](value);
    	}

    	let grid_props = {
    		cols: /*cols*/ ctx[4],
    		rowHeight: 50,
    		fillSpace: true,
    		$$slots: {
    			default: [
    				create_default_slot$1,
    				({ dataItem }) => ({ 11: dataItem }),
    				({ dataItem }) => dataItem ? 2048 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*items*/ ctx[2] !== void 0) {
    		grid_props.items = /*items*/ ctx[2];
    	}

    	grid = new Src({ props: grid_props, $$inline: true });
    	binding_callbacks.push(() => bind(grid, 'items', grid_items_binding));

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const grid_changes = {};

    			if (dirty & /*$$scope, $looperPadClickedState, dataItem, looperKeyAudioState, looperKeyPausedState*/ 6155) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_items && dirty & /*items*/ 4) {
    				updating_items = true;
    				grid_changes.items = /*items*/ ctx[2];
    				add_flush_callback(() => updating_items = false);
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $playing;
    	let $looperPadClickedState;
    	validate_store(playing, 'playing');
    	component_subscribe($$self, playing, $$value => $$invalidate(8, $playing = $$value));
    	validate_store(looperPadClickedState, 'looperPadClickedState');
    	component_subscribe($$self, looperPadClickedState, $$value => $$invalidate(3, $looperPadClickedState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KeyPads', slots, []);
    	let looperKeyAudioState = {};
    	let looperKeyPausedState = {};

    	const updatePausedState = () => {
    		const result = {};

    		for (const key in looperPadClickedState) {
    			result[key] = !(looperPadClickedState[key] && $playing);
    		}

    		$$invalidate(1, looperKeyPausedState = result);
    	};

    	looperPadClickedState.subscribe(updatePausedState);
    	playing.subscribe(updatePausedState);

    	function generateLayout(col) {
    		return looperPads.map((looperPad, i) => {
    			const y = Math.ceil(Math.random() * 4) + 1;

    			return {
    				16: gridHelp.item({
    					x: i * 2 % col,
    					y: Math.floor(i / 6) * y,
    					w: 3,
    					h: 3,
    					fixed: true
    				}),
    				id: id(),
    				data: {
    					looperPad,
    					start: randomHexColorCode(),
    					end: randomHexColorCode()
    				}
    			};
    		});
    	}

    	let cols = [[1287, 16]];
    	let items = gridHelp.adjust(generateLayout(16), 16);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<KeyPads> was created with unknown prop '${key}'`);
    	});

    	function audio_binding($$value, dataItem) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			looperKeyAudioState[dataItem.data.looperPad.id] = $$value;
    			$$invalidate(0, looperKeyAudioState);
    		});
    	}

    	function audio_play_pause_handler(dataItem) {
    		looperKeyPausedState[dataItem.data.looperPad.id] = this.paused;
    		$$invalidate(1, looperKeyPausedState);
    	}

    	function grid_items_binding(value) {
    		items = value;
    		$$invalidate(2, items);
    	}

    	$$self.$capture_state = () => ({
    		Grid: Src,
    		gridHelp,
    		id,
    		randomHexColorCode,
    		looperPadClickedState,
    		looperPads,
    		playing,
    		toggleKeyPadClickedState,
    		looperKeyAudioState,
    		looperKeyPausedState,
    		updatePausedState,
    		generateLayout,
    		cols,
    		items,
    		$playing,
    		$looperPadClickedState
    	});

    	$$self.$inject_state = $$props => {
    		if ('looperKeyAudioState' in $$props) $$invalidate(0, looperKeyAudioState = $$props.looperKeyAudioState);
    		if ('looperKeyPausedState' in $$props) $$invalidate(1, looperKeyPausedState = $$props.looperKeyPausedState);
    		if ('cols' in $$props) $$invalidate(4, cols = $$props.cols);
    		if ('items' in $$props) $$invalidate(2, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		looperKeyAudioState,
    		looperKeyPausedState,
    		items,
    		$looperPadClickedState,
    		cols,
    		audio_binding,
    		audio_play_pause_handler,
    		grid_items_binding
    	];
    }

    class KeyPads extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KeyPads",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.4 */
    const file = "src/App.svelte";

    // (11:4) <Col xs="1">
    function create_default_slot_4(ctx) {
    	let record;
    	let current;
    	record = new Record({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(record.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(record, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(record.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(record.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(record, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(11:4) <Col xs=\\\"1\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:4) <Col xs="1">
    function create_default_slot_3(ctx) {
    	let playcontrol;
    	let current;
    	playcontrol = new PlayControl({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(playcontrol.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(playcontrol, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playcontrol.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playcontrol.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(playcontrol, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(15:4) <Col xs=\\\"1\\\">",
    		ctx
    	});

    	return block;
    }

    // (10:2) <Row>
    function create_default_slot_2(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				xs: "1",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				xs: "1",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(10:2) <Row>",
    		ctx
    	});

    	return block;
    }

    // (23:4) <Col>
    function create_default_slot_1(ctx) {
    	let div;
    	let keypads;
    	let current;
    	keypads = new KeyPads({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(keypads.$$.fragment);
    			set_style(div, "max-width", "1100px");
    			set_style(div, "width", "100%");
    			add_location(div, file, 23, 6, 346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(keypads, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keypads.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keypads.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(keypads);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(23:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (22:2) <Row>
    function create_default_slot(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(22:2) <Row>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    			attr_dev(main, "class", "svelte-pimmlo");
    			add_location(main, file, 7, 0, 200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(row0, main, null);
    			append_dev(main, t);
    			mount_component(row1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(row0);
    			destroy_component(row1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Col, Row, PlayControl, Record, KeyPads });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
