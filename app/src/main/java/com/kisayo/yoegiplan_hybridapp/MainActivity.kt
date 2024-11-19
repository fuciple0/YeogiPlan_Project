package com.kisayo.yoegiplan_hybridapp

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.kisayo.yoegiplan_hybridapp.databinding.ActivityMainBinding


class MainActivity : AppCompatActivity() {

    private val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        binding.wv.apply {
            webViewClient = WebViewClient() // 기본 웹뷰 클라이언트 설정 (새창에서 열리는 것 방지)
            webChromeClient = WebChromeClient() // 파일 업로드, alert 등 크롬 기능 지원


            settings.apply {
                javaScriptEnabled = true       // 자바스크립트 활성화
                domStorageEnabled = true       // localStorage 사용 가능
                useWideViewPort = true         // 뷰포트 메타태그 지원
                loadWithOverviewMode = true    // 페이지 전체가 보이도록 설정
                allowFileAccess = true         // 파일 업로드 허용
                setSupportMultipleWindows(true)// 팝업창 지원
                setSupportZoom(true)           // 줌 기능 활성화
                textZoom = 100                 // 기본 텍스트 크기 설정
                cacheMode = WebSettings.LOAD_DEFAULT  // 캐시 사용하여 로딩 속도 향상
            }

            loadUrl("http://15.164.142.129")
        }
    }

    override fun onBackPressed() {
        if (binding.wv.canGoBack()) {
            binding.wv.goBack()
        } else {
            super.onBackPressed()
        }
    }
}