<template>
    <div>
        <!--<div id="qrcode" ref="qrcode" :style="style"></div>-->
        <vue-qr v-if="text" :logoSrc="logo" :text="text" :size="width"  :dotScale="0.99"></vue-qr>
    </div>
</template>

<script>
    import VueQr from 'vue-qr'

    export default {
        name: 'QrCode',
        data(){
            return {
                style:'',
                text:null
            }
        },
        props: {
            width: {
                type:Number,
                default:232
            },
            height:{
                type:Number,
                default:232
            },
            url:{
                type:String,
                default:undefined
            },
            logo:{
                type:String,
                default:require('@/assets/logo.png')
            }
        },
        components: {VueQr},
        mounted(){
            this.text = this.url;
            this.style={height:this.height+'px',width:this.width+'px',margin:'0 auto'}
            // new QRCode('qrcode', {
            //     width: this.width,  // 设置宽度
            //     height: this.height, // 设置高度
            //     text: this.url
            // })
        }
    }
</script>

<style scoped>
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>