<template>
  <div class="uk-dark uk-background-muted uk-card uk-card-default uk-card-body">
    <form>

      <fieldset class="uk-fieldset">

        <legend class="uk-legend">Emit</legend>

        <div class="uk-margin">
            <input class="uk-input" type="text" placeholder="Event" v-model="eventName">
        </div>

        <div class="uk-margin">
            <textarea class="uk-textarea" rows="5" placeholder="Message" v-model="eventMsg"></textarea>
        </div>

        <legend class="uk-legend">Response</legend>

        <div class="uk-margin">
            <input class="uk-input" type="text" placeholder="Listener" v-model="listenerName">
        </div>

        <h4 class="uk-heading uk-text-muted">Message</h4>

        <div class="uk-margin">
            <span id="msgBox"></span>
        </div>

        <div class="uk-margin">
          <button name="send" class="uk-button uk-button-primary" type="button" @click="send" disabled>Send</button>
        </div>

      </fieldset>
    </form>
  </div>
</template>

<script>
import bus from '../../commons/bus.js';
import JSONFormatter from 'json-formatter-js'

export default {
  
  props: ['socketObj'],

  data () {
    return {
      eventName: null,
      listenerName: null,
      eventMsg: null,
      responsedMsg: null
    }
  },

  methods: {
    send () {
      let eventName = this.eventName;
      let eventMsg = this.eventMsg;
      let listenerName = this.listenerName || 'test';

      if (eventName && eventMsg) {
        
        this.socketObj.emit(eventName, eventMsg);
        this.socketObj.once(listenerName, (d) => {
          let data;
          let msgBox = document.getElementById('msgBox');
          
          try {
            data = JSON.parse(d);
            let formatter = new JSONFormatter(data);
            msgBox.innerHTML = '';
            msgBox.appendChild(formatter.render());
          } catch (e) {
            bus.$emit('error', 'JSON Parse Error.')
          }

        });

      }
    }

  }
}
</script>

<style>
  
</style>

