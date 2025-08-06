# Rift

[![NPM version](https://img.shields.io/npm/v/@singlephon/rift.svg?style=flat)](https://www.npmjs.com/package/@singlephon/rift) 
[![NPM monthly downloads](https://img.shields.io/npm/dm/@singlephon/rift.svg?style=flat)](https://npmjs.org/package/@singlephon/rift) 
[![NPM total downloads](https://img.shields.io/npm/dt/@singlephon/rift.svg?style=flat)](https://npmjs.org/package/@singlephon/rift)

**A lightweight micro-framework that connects Blade, Livewire, Alpine.js, and JavaScript classes seamlessly for modern Laravel projects.**

---

## 🚀 Features

✅ **Generate** Livewire, Blade, and JS components in one command  
✅ **Connect** Blade ↔ Alpine.js ↔ JavaScript ↔ Livewire effortlessly  
✅ **Automatic JS dependency injection** with clean syntax  
✅ **Lightweight, clean API**  
✅ **Supports hot-reload, dynamic mounting, and reactivity**

---

## 🛠️ Installation

### PHP (Laravel)

Install via Composer:

```bash
composer require singlephon/rift
````

---

Then install via NPM:

### JavaScript (NPM)

```bash
npm install @singlephon/rift
```


### Import Rift in your `resources/js/app.js`:

```js
import { Rift } from "@singlephon/rift";

new Rift(import.meta.glob('./rift/**/*.js', { eager: true }))
    .start()
```

---

## Getting Started with Rift

### 1️⃣ Generate a new Rift component

```bash
php artisan rift:make counter
```

✅ You will see:

```
COMPONENT CREATED 🤙

CLASS: app/Livewire/Rift/Counter.php
VIEW:  resources/views/rift/counter.blade.php
JS:    resources/js/rift/counter.js
```

---

### 2️⃣ Add logic to your generated JS class

Open:

```
resources/js/rift/counter.js
```

Replace contents with:

```js
import { RiftComponent } from '@singlephon/rift';

export default class Counter extends RiftComponent {
    count = 1;

    increase() {
        this.count++;
    }

    decrease() {
        this.count--;
    }
}
```

---

### 3️⃣ Add UI to your generated Blade view

Open:

```
resources/views/rift/counter.blade.php
```

Replace contents with:

```blade
<x-rift component="counter">
    <p x-text="rift.count"></p>
    <button x-on:click="rift.increase()">+</button>
    <button x-on:click="rift.decrease()">-</button>
</x-rift>
```

---

### 4️⃣ Test your component

Add this to any page or Livewire component:

```blade
<livewire:rift.counter />
```

✅ Now visit your page:

* You will see a counter with `+` and `-` buttons.
* Clicking `+` increases the counter.
* Clicking `-` decreases the counter.
* The **state is reactive and persistent across Livewire updates**.

---

### Why Rift?

- ✅ Seamlessly **binds Blade, Alpine.js, JS classes, and Livewire**.
- ✅ Clean syntax with **no boilerplate**.
- ✅ CLI generator for **automatic structure creation**.
- ✅ Ready for **complex UI composition** with **clean separation of concerns**.

---

[//]: # (---)

[//]: # (### 2️⃣ Use in Blade:)

[//]: # ()
[//]: # (```blade)

[//]: # (<x-rift component="foo.bar">)

[//]: # (    <button @click="rift.plus&#40;&#41;">Increment</button>)

[//]: # (    <p x-text="rift.count"></p>)

[//]: # (</x-rift>)

[//]: # (```)

---

## 🗂 Project Structure

* `php` package (Composer): manages Blade + Livewire generation
* `js` package (npm): manages RiftContainer, RiftComponent, and automatic mounting

### Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

### Security

If you discover any security related issues, please email singlephon@gmail.com instead of using the issue tracker.

## Credits

-   [Rakhat Bakytzhanov](https://github.com/singlephon)
-   [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
