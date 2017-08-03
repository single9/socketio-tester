<template>
  <div id="auto-tester"><!-- Wrapper Start -->
    <div class="uk-card uk-card-body">
      <form>
          <fieldset class="uk-fieldset">

            <legend class="uk-legend">Auto Component</legend>

            <div class="uk-margin">
              <input class="uk-input" type="text" placeholder="Event Name" v-model="socketEvent.name">
            </div>

            <div class="uk-margin">
              <input class="uk-input" type="text" placeholder="Listener" v-model="socketEvent.listener">
            </div>

            <div class="uk-margin">
              <textarea class="uk-textarea" rows="5" placeholder="Content" v-model="socketEvent.content"></textarea>
            </div>

            <div class="uk-margin uk-child-width-auto">
              <input class="uk-input" placeholder="Delay (ms)" v-model="socketEvent.delay" type="number">
            </div>

            <div class="uk-margin">
              <button class="uk-button uk-button-primary" type="button" @click="add">Add</button>
              <button class="uk-button uk-button-primary uk-hidden" type="button" @click="edited">Edit</button>
              <button class="uk-button uk-button-default" type="reset" @click="reset">Reset</button>
            </div>

          </fieldset>
      </form>
    </div>
    <template v-if="steps">
      <div class="uk-padding uk-section uk-section-muted">
        <div class="uk-margin">
          <button id="clear" class="uk-button uk-button-default" type="button" @click="clearQueue">Clear</button>
          <button name="send" class="uk-button uk-button-secondary" type="button" @click="doProcess" disabled>Go</button>
        </div>
        <ul id="steps" class="uk-grid-small uk-child-width-1-3" uk-grid>
            <li v-for="(value, key, index) in steps" :id="key">
              <div class="uk-card uk-card-default uk-card-hover">
                <div class="uk-card-header">
                  <div class="uk-card-badge uk-label">{{key}}</div>
                  <h3 class="uk-card-title uk-margin-remove-bottom">{{value.name}}</h3>
                  <p class="uk-text-meta uk-margin-remove-top">{{value.delay}}</p>
                </div>

                <div class="uk-card-body">
                  <p>{{value.content}}</p>
                </div>
                <div class="uk-card-footer">
                  <button class="btn-scroll uk-button uk-button-text" @click="edit(key)">Edit</button> / 
                  <button class="btn-scroll uk-button uk-button-text" @click="copy(key)">Copy</button> / 
                  <button class="btn-scroll uk-button uk-button-text" @click="remove(key)">Remove</button>
                </div>
                
              </div>
            </li>
        </ul>
      </div>
    </template>
  </div> <!-- Wrapper End -->
</template>

<script>
import bus from '../../commons/bus.js';
import UIkit from 'uikit';
import $ from 'jquery';

function event_struct (name=null, content=null, listener=null, delay) {
  this.name = name;
  this.content = content;
  this.listener = listener;
  this.delay = delay;
};

export default {

  props: ['socketObj'],

  data () {
    return {
      uiDragCreated: false,
      steps: null,
      stepsQueue: [],
      socketEvent: new event_struct()
    }
  },

  created () {
    bus.$emit('setButtons');

    // Tester
    this.steps = [];
    for (let i=0; i<25; i++) {
      let ev = new event_struct('test', Math.random() * 1000, 'test', Math.floor(Math.random() * 3000));
      this.steps.push(ev);
    }
  },

  watch: {

    steps () {
      bus.$emit('setButtons');

      if (this.uiDragCreated === false) {
        this.uiDragCreated = true;
        setTimeout(() => {
          let steps = document.querySelector('#steps');
          UIkit.sortable(steps);
        }, 100);
      }

      setTimeout(() => {
        $('html, body').animate({
            scrollTop: $("#steps").offset().top
        }, 500);
      }, 100);
    },

    stepsQueue () {
      let clearBtn = document.getElementById('clear');
      if(this.steps.length <= 0) {
        clearBtn.setAttribute('disabled', true);
      } else {
        clearBtn.removeAttribute('disabled');
      }
    }
  },

  methods: {
    add () {
      let check = true;

      for (let sev in this.socketEvent) {
        if (sev === 'delay' || sev === 'content') {
          continue;
        } else if (this.socketEvent[sev] === null) {
          bus.$emit('error', sev + ' is required');
          check = false;
        }
      }

      if (check === false) return;

      if (this.steps === null) {
        this.steps = [];
      }

      this.steps.push(this.socketEvent);
      this.socketEvent = new event_struct();

    },

    reset () {
      this.socketEvent = new event_struct();
    },

    edited () {

    },

    doProcess () {
      if (this.stepsQueue.length === 0) {
        this.createQueue();
      }

      let current = this.stepsQueue.shift();

      this.doEvent(current);

    },

    doEvent (ev) {
      this.socketObj.emit(ev.name, ev.content);
      this.socketObj.once(ev.listener, (d) => {
        console.log(d);
        if (this.stepsQueue.length > 0) {
          setTimeout(()=>{
            this.doProcess();
          }, ev.delay);
        }
      });
    },

    edit (index) {
      this.socketEvent = this.steps[index];
      $('html, body').animate({
          scrollTop: $("#auto-tester").offset().top - 80
      }, 500);
    },

    remove (index) {
      if (index > -1) {
        this.steps.splice(index, 1);
        this.createQueue();
      }
    },

    copy (index) {

    },

    createQueue () {
      let newSteps = document.getElementById('steps').querySelectorAll('li');

      this.stepsQueue = [];

      for (let i=0; i<newSteps.length; i++) {
        let id = newSteps[i].id;
        this.stepsQueue.push(this.steps[id]);
      }
    },

    clearQueue () {
      this.steps = [];
      this.stepsQueue = [];
    }
  }
}
</script>

<style>
  
</style>
