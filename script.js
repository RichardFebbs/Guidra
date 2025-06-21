class Modal {
    #modal
    #backdrop
    #closeBtn
    #title
    #body
    #backBtn
    #nextBtn

    constructor(onBack, onNext, onClose) {
        this.#backdrop = document.createElement("div")
        this.#backdrop.classList.add("modal-backdrop")

        // Prevent click events from closing the modal
        this.#backdrop.addEventListener("click", (e) => {
            e.stopPropagation()
        })

        this.#modal = document.createElement("div")
        this.#modal.classList.add("modal")

        this.#closeBtn = document.createElement("button")
        this.#closeBtn.innerHTML = "&times;"
        this.#closeBtn.classList.add("close-btn")
        this.#closeBtn.addEventListener("click", onClose)
        this.#modal.append(this.#closeBtn)

        this.#title = document.createElement("header")
        this.#title.classList.add("title")
        this.#modal.append(this.#title)

        this.#body = document.createElement("div")
        this.#body.classList.add("body")
        this.#modal.append(this.#body)

        const footer = document.createElement("footer")
        footer.classList.add("footer")
        this.#modal.append(footer)

        this.#backBtn = document.createElement("button")
        this.#backBtn.textContent = "Back"
        this.#backBtn.addEventListener("click", onBack)
        footer.append(this.#backBtn)

        this.#nextBtn = document.createElement("button")
        this.#nextBtn.textContent = "Next"
        this.#nextBtn.addEventListener("click", onNext)
        footer.append(this.#nextBtn)

        document.body.append(this.#backdrop)
        document.body.append(this.#modal)
    }

    set title(value) {
        this.#title.innerText = value
    }

    set body(value) {
        this.#body.innerText = value
    }

    resetNextBtn() {
        this.#nextBtn.textContent = "Next"
    }

    toggleNextToDone() {
        this.#nextBtn.textContent = "Done"
    }

    show(value = true) {
        this.#backdrop.classList.toggle("show", value)
        this.#modal.classList.toggle("show", value)
    }

    center(value = true) {
        this.#modal.classList.toggle("center", value)
    }

    position({ bottom, left }) {
        const offset = ".5rem"
        this.#modal.style.setProperty(
            "--x",
            `calc(${left + window.scrollX}px + ${offset})`
        )
        this.#modal.style.setProperty(
            "--y",
            `calc(${bottom + window.scrollY}px + ${offset} + .25rem)`
        )
    }

    remove() {
        this.#modal.remove()
        this.#backdrop.remove()
    }

    enableBackButton(enabled) {
        this.#backBtn.disabled = !enabled
    }
}

class Intro {
    #modal
    #highlightContainer
    #bodyClick

    constructor(steps) {
        this.steps = steps
        this.#bodyClick = e => {
            if (
                e.target === this.#currentStep.element ||
                this.#currentStep.element?.contains(e.target) ||
                e.target.closest(".highlight-container") != null ||
                e.target.matches(".modal") ||
                e.target.closest(".modal") != null
            ) {
                return
            }

            this.finish()
        }
    }

    start() {
        this.currentStepIndex = 0
        this.#modal = new Modal(
            () => {
                this.currentStepIndex--
                this.#showCurrentStep()
            },
            () => {
                this.currentStepIndex++
                if (this.currentStepIndex >= this.steps.length) {
                    this.finish()
                } else {
                    this.#showCurrentStep()
                }
            },
            () => this.finish()
        )
        document.addEventListener("click", this.#bodyClick)
        this.#highlightContainer = this.#createHighlightContainer()
        window.addEventListener("resize", this.#onResizeOrScroll)
        window.addEventListener("scroll", this.#onResizeOrScroll, true)
        this.#showCurrentStep()
    }

    finish() {
        document.removeEventListener("click", this.#bodyClick)
        this.#modal.remove()
        this.#highlightContainer.remove()
        window.removeEventListener("resize", this.#onResizeOrScroll)
        window.removeEventListener("scroll", this.#onResizeOrScroll, true)

    }

    get #currentStep() {
        return this.steps[this.currentStepIndex]
    }

    #showCurrentStep() {
        this.#modal.show()
        this.#modal.enableBackButton(this.currentStepIndex !== 0)
        this.#modal.title = this.#currentStep.title
        this.#modal.body = this.#currentStep.body
        this.#modal.resetNextBtn()

        if (this.#currentStep.element == null) {
            this.#highlightContainer.classList.add("hide")
            this.#positionHighlightContainer({ x: 0, y: 0, width: 0, height: 0 })
            this.#modal.center()
        } else {
            this.#modal.center(false)
            const rect = this.#currentStep.element.getBoundingClientRect()
            this.#modal.position(rect)
            this.#highlightContainer.classList.remove("hide")
            this.#positionHighlightContainer(rect)
            this.#currentStep.element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            })
        }
        if (this.currentStepIndex + 1 >= this.steps.length) {
            this.#modal.toggleNextToDone()
        }
    }

    #createHighlightContainer() {
        const highlightContainer = document.createElement("div")
        highlightContainer.classList.add("highlight-container")
        document.body.append(highlightContainer)
        return highlightContainer
    }

    #positionHighlightContainer(rect) {
        const padding = 4
        this.#highlightContainer.style.top = `${rect.top + window.scrollY - padding}px`
        this.#highlightContainer.style.left = `${rect.left + window.scrollX - padding}px`
        this.#highlightContainer.style.width = `${rect.width + padding * 2}px`
        this.#highlightContainer.style.height = `${rect.height + padding * 2}px`
    }

    #onResizeOrScroll = () => {
        this.#showCurrentStep()
    }
}

const intro = new Intro([
    {
        title: "Test Title",
        body: "This is the body of the modal",
    },
    {
        title: "Test Title 2",
        body: "This is the body of the modal 2",
        element: document.querySelector("[data-first]"),
    },
    {
        title: "Test Title 3",
        body: "This is the body of the modal 3",
        element: document.querySelector("[data-second]"),
    },
    {
        title: "Test Title 4",
        body: "This is the body of the modal 4",
        element: document.querySelector("[data-third]"),
    },
    {
        title: "Test Title 5",
        body: "This is the body of the modal 5",
        element: document.querySelector("[data-fourth]"),
    },
    {
        title: "Test Title 6",
        body: "This is the body of the modal 6",
        element: document.querySelector("[data-fifth]"),
    },
])
intro.start()

// setTimeout(() => {
//   intro.finish()
// }, 12000)
