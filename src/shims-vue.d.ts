declare module '*.vue' {
  import Vue from 'vue'
  export default Vue

  import { MetaInfo } from 'vue-meta';

  /**
   * Vue meta
   */
  declare module 'vue/types/vue' {
    interface Vue {
      metaInfo?: MetaInfo | (() => MetaInfo);
    }
  }

  declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
      metaInfo?: MetaInfo | (() => MetaInfo);
    }
  }
}