<template>
    <div>
        <div class="solar">
            <i class="mercury"></i>
            <i class="venus"></i>
            <i class="earth"></i>
            <i class="mars"></i>
            <i class="belt"></i>
            <i class="jupiter"></i>
            <i class="saturn"></i>
            <i class="uranus"></i>
            <i class="neptune"></i>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
    export default{
        name: 'loading'
    }

</script>

<style lang="scss" type="text/scss">
    
    .solar{
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 999;
        height: 450px;
        width: 450px;
        margin: -225px 0 0 -225px;
        &:before{
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -25px 0 0 -25px;
            display: block;
            height: 50px;
            width: 50px;
            background: orange;
            border-radius: 25px;
            animation: glow 1.5s linear infinite;
        }
        i{
            position: absolute;
            display: block;
            border-radius: 250px;
            border: 1px solid rgba(255, 255, 255, .5);
            box-sizing: border-box;
            transform-origin: 50% 50%;
            &:before{
                content: '';
                position: absolute;
                top: -5px;
                right: 45%;
                display: block;
                border-radius: 25px;
                background: black;
            }
        }
        .mercury{
            left: 50%;
            top: 50%;
            width: 80px;
            height: 80px;
            margin-left: -40px;
            margin-top: -40px;
            animation: orbit .5s linear infinite;
            &:before{
                height: 7px;
                width: 7px;
                background: #6f5f5f;
            }
        }
        .venus{
            left: 50%;
            top: 50%;
            width: 110px;
            height: 110px;
            margin-left: -55px;
            margin-top: -55px;
            animation: orbit 1s linear infinite;
            &:before{
                height: 10px;
                width: 10px;
                background: #e7a71f;
            }
        }
        
        .earth{
            left: 50%;
            top: 50%;
            width: 140px;
            height: 140px;
            margin-left: -70px;
            margin-top: -70px;
            animation: orbit 1.5s linear infinite;
            &:before{
                height: 10px;
                width: 10px;
                background: #63bee2;
            }
        }
        
        .mars{
            left: 50%;
            top: 50%;
            width: 170px;
            height: 170px;
            margin-left: -85px;
            margin-top: -85px;
            animation: orbit 2s linear infinite;
            &:before{
                height: 10px;
                width: 10px;
                background: red;
            }
        }
        
        .belt{
            left: 50%;
            top: 50%;
            width: 240px;
            height: 240px;
            margin-left: -120px;
            margin-top: -120px;
            border: 25px solid rgba(36, 35, 35, 0.21);
            box-sizing: border-box;
        }
        
        .jupiter{
            left: 50%;
            top: 50%;
            width: 260px;
            height: 260px;
            margin-left: -130px;
            margin-top: -130px;
            animation: orbit 2.5s linear infinite;
            &:before{
                top: -15px;
                height: 30px;
                width: 30px;
                background: #cf9b2b;
            }
        }
        
        .saturn{
            left: 50%;
            top: 50%;
            width: 320px;
            height: 320px;
            margin-left: -160px;
            margin-top: -160px;
            animation: orbit 3s linear infinite;
            &:before{
                top: -10px;
                height: 20px;
                width: 20px;
                background: #cf7a2b;
            }
            &:after{
                content: '';
                position: absolute;
                right: 43.5%;
                display: block;
                width: 30px;
                height: 1px;
                background: #fff;
                transform: rotate(20deg);
            }
        }
        
        .uranus{
            left: 50%;
            top: 50%;
            width: 360px;
            height: 360px;
            margin-left: -180px;
            margin-top: -180px;
            animation: orbit 3.5s linear infinite;
            &:before{
                top: -8px;
                height: 15px;
                width: 15px;
                background: #10c593;
            }
        }
        
        .neptune{
            left: 50%;
            top: 50%;
            width: 400px;
            height: 400px;
            margin-left: -200px;
            margin-top: -200px;
            animation: orbit 4s linear infinite;
            &:before{
                top: -8px;
                height: 15px;
                width: 15px;
                background: #1470e4;
            }
        }
    }
    
    @keyframes orbit{
        0%{
            transform: rotate(0deg);
        }
        50%{
            transform: rotate(-180deg);
        }
        100%{
            transform: rotate(-360deg);
        }
    }
    
    @keyframes glow{
        0%{
            box-shadow: none;
        }
        50%{
            background: #ffeb00;
            box-shadow: 0 0 20px orange;
        }
        100%{
            box-shadow: none;
        }
    }

</style>